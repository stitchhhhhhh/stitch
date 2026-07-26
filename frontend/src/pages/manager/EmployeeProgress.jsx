import { useEffect, useMemo, useState } from "react";

import ProgressStatCard from "../../components/manager/employeeProgress/ProgressStatCard";
import EmployeeProgressTable from "../../components/manager/employeeProgress/EmployeeProgressTable";
import TopPerformers from "../../components/manager/employeeProgress/TopPerformers";
import UpcomingDeadlines from "../../components/manager/employeeProgress/UpcomingDeadlines";
import RecentActivities from "../../components/manager/employeeProgress/RecentActivities";

import {
  getCurrentManagerProfile,
  getDepartmentEnrollments,
} from "../../services/managerService";

function normalizeStatus(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function downloadCsv(rows) {
  const headers = [
    "Employee",
    "Email",
    "Training",
    "Progress",
    "Status",
    "Deadline",
  ];

  const values = rows.map((item) => [
    item.name,
    item.email,
    item.training,
    `${item.progress}%`,
    item.status,
    item.deadline || "",
  ]);

  const escapeCell = (value) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;

  const csv = [headers, ...values]
    .map((row) =>
      row.map(escapeCell).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "department-employee-progress.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export default function EmployeeProgress() {
  const [enrollments, setEnrollments] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] =
    useState("");
  const [courseFilter, setCourseFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    loadEmployeeProgress();
  }, []);

  async function loadEmployeeProgress() {
    try {
      setLoading(true);
      setError("");

      const profile =
        await getCurrentManagerProfile();

      const departmentId =
        profile.department?.id;

      if (!departmentId) {
        throw new Error(
          "Manager belum memiliki department."
        );
      }

      const result =
        await getDepartmentEnrollments(
          departmentId,
          {
            page: 1,
            limit: 100,
          }
        );

      setEnrollments(result.data);
    } catch (err) {
      setError(
        err?.message ||
          "Gagal memuat employee progress."
      );
    } finally {
      setLoading(false);
    }
  }

  const employees = useMemo(
    () =>
      enrollments.map((item) => ({
        id: item.id,
        userId: item.user?.id,
        name:
          item.user?.full_name ||
          "Unknown Employee",
        email: item.user?.email || "-",
        role: item.user?.email || "-",
        training:
          item.course?.course_title ||
          "Untitled Course",
        courseId: item.course?.id,
        progress: Math.min(
          100,
          Math.max(
            0,
            Number(
              item.completion_percentage
            ) || 0
          )
        ),
        score: null,
        status: normalizeStatus(
          item.status
        ),
        rawStatus: item.status || "",
        assignedDate:
          item.assigned_date,
        deadline:
          item.course?.deadline,
      })),
    [enrollments]
  );

  const courses = useMemo(
    () =>
      Array.from(
        new Map(
          employees.map((item) => [
            item.courseId,
            {
              id: item.courseId,
              title: item.training,
            },
          ])
        ).values()
      ).filter((item) => item.id),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return employees.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name
          .toLowerCase()
          .includes(keyword) ||
        item.email
          .toLowerCase()
          .includes(keyword) ||
        item.training
          .toLowerCase()
          .includes(keyword);

      const matchesCourse =
        courseFilter === "all" ||
        String(item.courseId) ===
          courseFilter;

      const matchesStatus =
        statusFilter === "all" ||
        item.rawStatus === statusFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    courseFilter,
    statusFilter,
  ]);

  const progressStats = useMemo(() => {
    const uniqueEmployees = new Set(
      employees.map((item) => item.userId)
    ).size;

    const completed = employees.filter(
      (item) =>
        item.rawStatus === "completed" ||
        item.progress >= 100
    ).length;

    const inProgress = employees.filter(
      (item) =>
        item.rawStatus === "in_progress" ||
        (item.progress > 0 &&
          item.progress < 100)
    ).length;

    const averageProgress =
      employees.length > 0
        ? Math.round(
            employees.reduce(
              (total, item) =>
                total + item.progress,
              0
            ) / employees.length
          )
        : 0;

    return [
      {
        title: "Employees",
        value: uniqueEmployees,
        subtitle:
          "Employees with training",
      },
      {
        title: "Completed",
        value: completed,
        subtitle:
          "Completed enrollments",
      },
      {
        title: "In Progress",
        value: inProgress,
        subtitle:
          "Active enrollments",
      },
      {
        title: "Average Progress",
        value: `${averageProgress}%`,
        subtitle:
          "Across all enrollments",
      },
    ];
  }, [employees]);

  const topPerformers = useMemo(() => {
    const grouped = new Map();

    employees.forEach((item) => {
      const current =
        grouped.get(item.userId) || {
          id: item.userId,
          name: item.name,
          total: 0,
          count: 0,
        };

      current.total += item.progress;
      current.count += 1;

      grouped.set(item.userId, current);
    });

    return Array.from(grouped.values())
      .map((item) => ({
        id: item.id,
        name: item.name,
        progress: Math.round(
          item.total / item.count
        ),
      }))
      .sort(
        (first, second) =>
          second.progress -
          first.progress
      )
      .slice(0, 5);
  }, [employees]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();

    return employees
      .filter((item) => {
        if (
          !item.deadline ||
          item.progress >= 100
        ) {
          return false;
        }

        const deadline = new Date(
          item.deadline
        );

        return (
          !Number.isNaN(
            deadline.getTime()
          ) && deadline >= now
        );
      })
      .sort(
        (first, second) =>
          new Date(first.deadline) -
          new Date(second.deadline)
      )
      .slice(0, 5);
  }, [employees]);

  const recentActivities = useMemo(
    () =>
      [...employees]
        .filter(
          (item) => item.assignedDate
        )
        .sort(
          (first, second) =>
            new Date(
              second.assignedDate
            ) -
            new Date(
              first.assignedDate
            )
        )
        .slice(0, 5),
    [employees]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-gray-500">
          Loading employee progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-red-600 mb-4">
          {error}
        </p>

        <button
          type="button"
          onClick={loadEmployeeProgress}
          className="bg-[#4453F2] text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Employee Progress
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor employee learning
            progress and training
            completion.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            downloadCsv(
              filteredEmployees
            )
          }
          disabled={
            filteredEmployees.length === 0
          }
          className="bg-[#4453F2] text-white px-5 py-3 rounded-xl hover:bg-[#3442d9] transition disabled:opacity-50"
        >
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {progressStats.map((item) => (
          <ProgressStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-5 flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={courseFilter}
            onChange={(event) =>
              setCourseFilter(
                event.target.value
              )
            }
            className="border rounded-xl px-4 py-2"
          >
            <option value="all">
              All Courses
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="border rounded-xl px-4 py-2"
          >
            <option value="all">
              All Statuses
            </option>
            <option value="not_started">
              Not Started
            </option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search employee..."
          className="border rounded-xl px-4 py-2 w-full xl:w-64"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <EmployeeProgressTable
            employees={
              filteredEmployees
            }
          />
        </div>

        <div className="xl:col-span-4 space-y-6">
          <TopPerformers
            performers={topPerformers}
          />

          <UpcomingDeadlines
            deadlines={
              upcomingDeadlines
            }
          />

          <RecentActivities
            activities={
              recentActivities
            }
          />
        </div>
      </div>
    </div>
  );
}