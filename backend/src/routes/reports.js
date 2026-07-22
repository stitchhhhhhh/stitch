const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { PrismaClient } = require("@prisma/client");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/auth");

const prisma = new PrismaClient();

/**
 * Mengambil data enrollment General Training untuk report HR.
 */
async function getGeneralTrainingReportData() {
  return prisma.courseEnrollment.findMany({
    where: {
      user: {
        role: {
          name: "EMPLOYEE",
        },
      },
      course: {
        program: {
          program_type: "GENERAL",
        },
      },
    },
    select: {
      id: true,
      completion_percentage: true,
      status: true,
      assigned_date: true,

      user: {
        select: {
          id: true,
          full_name: true,
          email: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      course: {
        select: {
          id: true,
          course_title: true,
          approval_status: true,
          deadline: true,

          trainer: {
            select: {
              full_name: true,
            },
          },

          program: {
            select: {
              program_name: true,
              program_type: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        assigned_date: "desc",
      },
      {
        id: "desc",
      },
    ],
  });
}

/**
 * Mengubah data database menjadi row report.
 */
function mapReportRows(enrollments) {
  return enrollments.map((enrollment) => ({
    employeeName: enrollment.user.full_name,
    employeeEmail: enrollment.user.email,
    department:
      enrollment.user.department?.name || "-",

    programName:
      enrollment.course.program.program_name,

    courseTitle: enrollment.course.course_title,

    trainerName:
      enrollment.course.trainer?.full_name || "-",

    courseStatus: enrollment.course.approval_status,

    enrollmentStatus: enrollment.status,

    progress: enrollment.completion_percentage || 0,

    assignedDate: enrollment.assigned_date,

    deadline: enrollment.course.deadline,
  }));
}

/**
 * GET /api/reports/summary
 *
 * Data ringkasan untuk halaman Reports.
 */
router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("HR"),
  async (req, res) => {
    try {
      const enrollments =
        await getGeneralTrainingReportData();

      const totalEnrollments = enrollments.length;

      const completedEnrollments = enrollments.filter(
        (item) => item.status === "completed"
      ).length;

      const uniqueEmployees = new Set(
        enrollments.map((item) => item.user.id)
      ).size;

      const certificatesIssued =
        await prisma.certificate.count({
          where: {
            user: {
              role: {
                name: "EMPLOYEE",
              },
            },
            course: {
              program: {
                program_type: "GENERAL",
              },
            },
          },
        });

      const completionRate =
        totalEnrollments > 0
          ? Number(
              (
                (completedEnrollments /
                  totalEnrollments) *
                100
              ).toFixed(2)
            )
          : 0;

      return res.json({
        employeesTrained: uniqueEmployees,
        totalEnrollments,
        coursesCompleted: completedEnrollments,
        certificatesIssued,
        completionRate,
        recentEnrollments: mapReportRows(
          enrollments.slice(0, 10)
        ),
      });
    } catch (error) {
      console.error(
        "GET /api/reports/summary:",
        error
      );

      return res.status(500).json({
        message: "Gagal mengambil ringkasan laporan",
      });
    }
  }
);

/**
 * GET /api/reports/export/excel
 *
 * Export report General Training ke Excel.
 */
router.get(
  "/export/excel",
  authMiddleware,
  roleMiddleware("HR"),
  async (req, res) => {
    try {
      const enrollments =
        await getGeneralTrainingReportData();

      const rows = mapReportRows(enrollments);

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "Learning Company LMS";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet(
        "General Training Report"
      );

      sheet.columns = [
        {
          header: "Employee Name",
          key: "employeeName",
          width: 25,
        },
        {
          header: "Employee Email",
          key: "employeeEmail",
          width: 30,
        },
        {
          header: "Department",
          key: "department",
          width: 22,
        },
        {
          header: "Program Name",
          key: "programName",
          width: 30,
        },
        {
          header: "Course Title",
          key: "courseTitle",
          width: 30,
        },
        {
          header: "Trainer",
          key: "trainerName",
          width: 25,
        },
        {
          header: "Course Status",
          key: "courseStatus",
          width: 18,
        },
        {
          header: "Enrollment Status",
          key: "enrollmentStatus",
          width: 20,
        },
        {
          header: "Progress (%)",
          key: "progress",
          width: 15,
        },
        {
          header: "Assigned Date",
          key: "assignedDate",
          width: 18,
        },
        {
          header: "Deadline",
          key: "deadline",
          width: 18,
        },
      ];

      const headerRow = sheet.getRow(1);

      headerRow.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF253B80",
        },
      };

      headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      headerRow.height = 25;

      for (const row of rows) {
        sheet.addRow({
          employeeName: row.employeeName,
          employeeEmail: row.employeeEmail,
          department: row.department,
          programName: row.programName,
          courseTitle: row.courseTitle,
          trainerName: row.trainerName,
          courseStatus: row.courseStatus,
          enrollmentStatus: row.enrollmentStatus,
          progress: row.progress,

          assignedDate: row.assignedDate
            ? new Date(row.assignedDate)
            : null,

          deadline: row.deadline
            ? new Date(row.deadline)
            : null,
        });
      }

      sheet.getColumn("assignedDate").numFmt =
        "dd mmmm yyyy";

      sheet.getColumn("deadline").numFmt =
        "dd mmmm yyyy";

      sheet.views = [
        {
          state: "frozen",
          ySplit: 1,
        },
      ];

      sheet.autoFilter = {
        from: "A1",
        to: "K1",
      };

      const exportedDate = new Date()
        .toISOString()
        .slice(0, 10);

      const filename =
        `general-training-report-${exportedDate}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      await workbook.xlsx.write(res);
      return res.end();
    } catch (error) {
      console.error(
        "GET /api/reports/export/excel:",
        error
      );

      if (!res.headersSent) {
        return res.status(500).json({
          message: "Gagal membuat laporan Excel",
        });
      }

      return res.end();
    }
  }
);

/**
 * GET /api/reports/export/pdf
 *
 * Export report General Training ke PDF.
 */
router.get(
  "/export/pdf",
  authMiddleware,
  roleMiddleware("HR"),
  async (req, res) => {
    try {
      const enrollments =
        await getGeneralTrainingReportData();

      const rows = mapReportRows(enrollments);

      const exportedDate = new Date()
        .toISOString()
        .slice(0, 10);

      const filename =
        `general-training-report-${exportedDate}.pdf`;

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      const document = new PDFDocument({
        margin: 35,
        size: "A4",
        layout: "landscape",
      });

      document.pipe(res);

      document
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("General Training Report", {
          align: "center",
        });

      document
        .moveDown(0.4)
        .fontSize(9)
        .font("Helvetica")
        .text(
          `Generated: ${new Date().toLocaleString(
            "en-US"
          )}`,
          {
            align: "center",
          }
        );

      document.moveDown(1.5);

      const columns = [
        {
          title: "Employee",
          x: 35,
          width: 100,
        },
        {
          title: "Department",
          x: 135,
          width: 80,
        },
        {
          title: "Program",
          x: 215,
          width: 115,
        },
        {
          title: "Course",
          x: 330,
          width: 115,
        },
        {
          title: "Trainer",
          x: 445,
          width: 90,
        },
        {
          title: "Progress",
          x: 535,
          width: 55,
        },
        {
          title: "Status",
          x: 590,
          width: 80,
        },
        {
          title: "Assigned",
          x: 670,
          width: 80,
        },
      ];

      function drawTableHeader(y) {
        document
          .font("Helvetica-Bold")
          .fontSize(8);

        for (const column of columns) {
          document.text(
            column.title,
            column.x,
            y,
            {
              width: column.width,
            }
          );
        }

        document
          .moveTo(35, y + 14)
          .lineTo(755, y + 14)
          .stroke();

        return y + 20;
      }

      let y = drawTableHeader(document.y);

      document
        .font("Helvetica")
        .fontSize(7);

      for (const row of rows) {
        if (y > 520) {
          document.addPage();
          y = drawTableHeader(35);

          document
            .font("Helvetica")
            .fontSize(7);
        }

        const assignedDate = row.assignedDate
          ? new Date(
              row.assignedDate
            ).toLocaleDateString("en-US")
          : "-";

        document.text(
          row.employeeName,
          columns[0].x,
          y,
          {
            width: columns[0].width,
          }
        );

        document.text(
          row.department,
          columns[1].x,
          y,
          {
            width: columns[1].width,
          }
        );

        document.text(
          row.programName,
          columns[2].x,
          y,
          {
            width: columns[2].width,
          }
        );

        document.text(
          row.courseTitle,
          columns[3].x,
          y,
          {
            width: columns[3].width,
          }
        );

        document.text(
          row.trainerName,
          columns[4].x,
          y,
          {
            width: columns[4].width,
          }
        );

        document.text(
          `${row.progress}%`,
          columns[5].x,
          y,
          {
            width: columns[5].width,
          }
        );

        document.text(
          row.enrollmentStatus,
          columns[6].x,
          y,
          {
            width: columns[6].width,
          }
        );

        document.text(
          assignedDate,
          columns[7].x,
          y,
          {
            width: columns[7].width,
          }
        );

        y += 28;
      }

      if (rows.length === 0) {
        document
          .fontSize(11)
          .text(
            "No General Training enrollment data is available.",
            35,
            y + 20,
            {
              align: "center",
            }
          );
      }

      document.end();
    } catch (error) {
      console.error(
        "GET /api/reports/export/pdf:",
        error
      );

      if (!res.headersSent) {
        return res.status(500).json({
          message: "Gagal membuat laporan PDF",
        });
      }

      return res.end();
    }
  }
);

/**
 * GET /api/reports/export/department/:deptId/excel
 *
 * Export laporan departemen.
 */
router.get(
  "/export/department/:deptId/excel",
  authMiddleware,
  roleMiddleware("HR", "MANAGER"),
  async (req, res) => {
    try {
      const departmentId = Number(req.params.deptId);

      if (
        !Number.isInteger(departmentId) ||
        departmentId <= 0
      ) {
        return res.status(400).json({
          message: "Department ID tidak valid",
        });
      }

      if (
        req.user.role === "MANAGER" &&
        req.user.department_id !== departmentId
      ) {
        return res.status(403).json({
          message:
            "Manager hanya dapat mengekspor departemennya sendiri",
        });
      }

      const department =
        await prisma.department.findUnique({
          where: {
            id: departmentId,
          },
          select: {
            id: true,
            name: true,
          },
        });

      if (!department) {
        return res.status(404).json({
          message: "Departemen tidak ditemukan",
        });
      }

      const enrollments =
        await prisma.courseEnrollment.findMany({
          where: {
            user: {
              department_id: departmentId,
              role: {
                name: "EMPLOYEE",
              },
            },
          },
          select: {
            completion_percentage: true,
            status: true,
            assigned_date: true,

            user: {
              select: {
                full_name: true,
                email: true,
              },
            },

            course: {
              select: {
                course_title: true,
                deadline: true,
              },
            },
          },
          orderBy: {
            assigned_date: "desc",
          },
        });

      const workbook = new ExcelJS.Workbook();

      const sheet = workbook.addWorksheet(
        `Report - ${department.name}`.slice(
          0,
          31
        )
      );

      sheet.columns = [
        {
          header: "Employee Name",
          key: "name",
          width: 25,
        },
        {
          header: "Email",
          key: "email",
          width: 30,
        },
        {
          header: "Course",
          key: "course",
          width: 30,
        },
        {
          header: "Progress (%)",
          key: "progress",
          width: 15,
        },
        {
          header: "Status",
          key: "status",
          width: 18,
        },
        {
          header: "Assigned Date",
          key: "assignedDate",
          width: 18,
        },
        {
          header: "Deadline",
          key: "deadline",
          width: 18,
        },
      ];

      sheet.getRow(1).font = {
        bold: true,
      };

      for (const enrollment of enrollments) {
        sheet.addRow({
          name: enrollment.user.full_name,
          email: enrollment.user.email,
          course: enrollment.course.course_title,
          progress:
            enrollment.completion_percentage || 0,
          status: enrollment.status,

          assignedDate: new Date(
            enrollment.assigned_date
          ),

          deadline: enrollment.course.deadline
            ? new Date(enrollment.course.deadline)
            : null,
        });
      }

      sheet.getColumn("assignedDate").numFmt =
        "dd mmmm yyyy";

      sheet.getColumn("deadline").numFmt =
        "dd mmmm yyyy";

      const safeDepartmentName =
        department.name.replace(
          /[^a-zA-Z0-9-_]/g,
          "-"
        );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report-${safeDepartmentName}.xlsx"`
      );

      await workbook.xlsx.write(res);
      return res.end();
    } catch (error) {
      console.error(
        "GET department report:",
        error
      );

      if (!res.headersSent) {
        return res.status(500).json({
          message:
            "Gagal membuat laporan departemen",
        });
      }

      return res.end();
    }
  }
);

module.exports = router;