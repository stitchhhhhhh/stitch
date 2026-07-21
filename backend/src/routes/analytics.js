const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/auth");

const prisma = new PrismaClient();

/**
 * Mengubah nama status menjadi format yang lebih mudah dibaca.
 */
function formatStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * GET /api/analytics/company
 *
 * Analytics khusus HR:
 * - General Training Program
 * - General Course
 * - Employee only
 */
router.get(
  "/company",
  authMiddleware,
  roleMiddleware("HR"),
  async (req, res) => {
    try {
      const [
        totalEmployees,
        totalGeneralPrograms,
        totalGeneralCourses,
        pendingCourseReviews,
        enrollments,
        certificatesIssued,
        averageScoreResult,
        courseStatusGroups,
      ] = await Promise.all([
        // Hanya user aktif dengan role EMPLOYEE
        prisma.user.count({
          where: {
            status: "active",
            role: {
              name: "EMPLOYEE",
            },
          },
        }),

        // Hanya General Training Program
        prisma.trainingProgram.count({
          where: {
            program_type: "GENERAL",
          },
        }),

        // Hanya course yang berada di General Program
        prisma.course.count({
          where: {
            program: {
              program_type: "GENERAL",
            },
          },
        }),

        // Course General yang menunggu review HR
        prisma.course.count({
          where: {
            approval_status: "submitted",
            program: {
              program_type: "GENERAL",
            },
          },
        }),

        // Enrollment employee pada General Course
        prisma.courseEnrollment.findMany({
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
            assigned_date: true,
            completion_percentage: true,
            status: true,
            user: {
              select: {
                id: true,
                full_name: true,
                department_id: true,
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
              },
            },
          },
          orderBy: {
            assigned_date: "desc",
          },
        }),

        // Sertifikat untuk General Course
        prisma.certificate.count({
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
        }),

        // Rata-rata nilai assessment General Course
        prisma.assessmentResult.aggregate({
          where: {
            user: {
              role: {
                name: "EMPLOYEE",
              },
            },
            assessment: {
              course: {
                program: {
                  program_type: "GENERAL",
                },
              },
            },
          },
          _avg: {
            score: true,
          },
        }),

        // Distribusi status General Course
        prisma.course.groupBy({
          by: ["approval_status"],
          where: {
            program: {
              program_type: "GENERAL",
            },
          },
          _count: {
            _all: true,
          },
        }),
      ]);

      const totalEnrollments = enrollments.length;

      const completedEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "completed"
      ).length;

      const inProgressEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "in_progress"
      ).length;

      const assignedEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "assigned"
      ).length;

      const completionRate =
        totalEnrollments > 0
          ? Number(
              ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
            )
          : 0;

      const averageAssessmentScore = Number(
        (averageScoreResult._avg.score || 0).toFixed(2)
      );

      /**
       * Statistik per departemen.
       */
      const departmentMap = new Map();

      for (const enrollment of enrollments) {
        const departmentId =
          enrollment.user.department?.id ??
          enrollment.user.department_id ??
          0;

        const departmentName =
          enrollment.user.department?.name || "No Department";

        if (!departmentMap.has(departmentId)) {
          departmentMap.set(departmentId, {
            departmentId,
            departmentName,
            totalEnrollments: 0,
            completedEnrollments: 0,
            inProgressEnrollments: 0,
            assignedEnrollments: 0,
            totalProgress: 0,
          });
        }

        const department = departmentMap.get(departmentId);

        department.totalEnrollments += 1;
        department.totalProgress +=
          enrollment.completion_percentage || 0;

        if (enrollment.status === "completed") {
          department.completedEnrollments += 1;
        } else if (enrollment.status === "in_progress") {
          department.inProgressEnrollments += 1;
        } else {
          department.assignedEnrollments += 1;
        }
      }

      const departmentPerformance = Array.from(
        departmentMap.values()
      )
        .map((department) => ({
          departmentId: department.departmentId,
          departmentName: department.departmentName,
          totalEnrollments: department.totalEnrollments,
          completedEnrollments:
            department.completedEnrollments,
          inProgressEnrollments:
            department.inProgressEnrollments,
          assignedEnrollments:
            department.assignedEnrollments,
          completionRate:
            department.totalEnrollments > 0
              ? Number(
                  (
                    (department.completedEnrollments /
                      department.totalEnrollments) *
                    100
                  ).toFixed(2)
                )
              : 0,
          averageProgress:
            department.totalEnrollments > 0
              ? Number(
                  (
                    department.totalProgress /
                    department.totalEnrollments
                  ).toFixed(2)
                )
              : 0,
        }))
        .sort(
          (first, second) =>
            second.completionRate - first.completionRate
        );

      /**
       * Aktivitas 6 bulan terakhir.
       *
       * Karena CourseEnrollment belum memiliki completed_date,
       * completed dihitung berdasarkan assigned_date enrollment.
       */
      const now = new Date();
      const monthlyMap = new Map();

      for (let index = 5; index >= 0; index -= 1) {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - index,
          1
        );

        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        monthlyMap.set(key, {
          key,
          month: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          assigned: 0,
          completed: 0,
        });
      }

      for (const enrollment of enrollments) {
        const assignedDate = new Date(
          enrollment.assigned_date
        );

        const key = `${assignedDate.getFullYear()}-${String(
          assignedDate.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthlyMap.has(key)) continue;

        const monthlyData = monthlyMap.get(key);

        monthlyData.assigned += 1;

        if (enrollment.status === "completed") {
          monthlyData.completed += 1;
        }
      }

      const monthlyTrend = Array.from(monthlyMap.values());

      const courseStatusDistribution =
        courseStatusGroups.map((group) => ({
          status: group.approval_status,
          label: formatStatus(group.approval_status),
          total: group._count._all,
        }));

      const recentEnrollments = enrollments
        .slice(0, 10)
        .map((enrollment) => ({
          enrollmentId: enrollment.id,
          employeeName: enrollment.user.full_name,
          department:
            enrollment.user.department?.name ||
            "No Department",
          courseTitle: enrollment.course.course_title,
          status: enrollment.status,
          completionPercentage:
            enrollment.completion_percentage || 0,
          assignedDate: enrollment.assigned_date,
        }));

      res.set("Cache-Control", "private, max-age=30");

      return res.json({
        totalEmployees,
        totalGeneralPrograms,
        totalGeneralCourses,
        pendingCourseReviews,

        totalEnrollments,
        completedEnrollments,
        inProgressEnrollments,
        assignedEnrollments,

        completionRate,
        averageAssessmentScore,
        certificatesIssued,

        courseStatusDistribution,
        monthlyTrend,
        departmentPerformance,
        recentEnrollments,
      });
    } catch (error) {
      console.error("GET /api/analytics/company:", error);

      return res.status(500).json({
        message: "Gagal mengambil analytics perusahaan",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }
  }
);

/**
 * GET /api/analytics/department/:deptId
 *
 * Dipakai HR atau Manager untuk analytics departemen.
 */
router.get(
  "/department/:deptId",
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
            "Manager hanya dapat melihat departemennya sendiri",
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

      const [totalEmployees, enrollments, averageScore] =
        await Promise.all([
          prisma.user.count({
            where: {
              department_id: departmentId,
              status: "active",
              role: {
                name: "EMPLOYEE",
              },
            },
          }),

          prisma.courseEnrollment.findMany({
            where: {
              user: {
                department_id: departmentId,
                role: {
                  name: "EMPLOYEE",
                },
              },
            },
            select: {
              status: true,
              completion_percentage: true,
            },
          }),

          prisma.assessmentResult.aggregate({
            where: {
              user: {
                department_id: departmentId,
                role: {
                  name: "EMPLOYEE",
                },
              },
            },
            _avg: {
              score: true,
            },
          }),
        ]);

      const totalEnrollments = enrollments.length;

      const completedEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "completed"
      ).length;

      const completionRate =
        totalEnrollments > 0
          ? Number(
              (
                (completedEnrollments / totalEnrollments) *
                100
              ).toFixed(2)
            )
          : 0;

      const averageProgress =
        totalEnrollments > 0
          ? Number(
              (
                enrollments.reduce(
                  (total, enrollment) =>
                    total +
                    (enrollment.completion_percentage || 0),
                  0
                ) / totalEnrollments
              ).toFixed(2)
            )
          : 0;

      return res.json({
        department,
        totalEmployees,
        totalEnrollments,
        completedEnrollments,
        completionRate,
        averageProgress,
        averageAssessmentScore: Number(
          (averageScore._avg.score || 0).toFixed(2)
        ),
      });
    } catch (error) {
      console.error(
        "GET /api/analytics/department/:deptId:",
        error
      );

      return res.status(500).json({
        message: "Gagal mengambil analytics departemen",
      });
    }
  }
);

module.exports = router;