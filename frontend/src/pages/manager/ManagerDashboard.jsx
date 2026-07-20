import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getManagerAnalytics,
  getManagerDashboard,
} from "../../services/managerService";

import DashboardHeader from "../../components/manager/dashboard/DashboardHeader";
import KPIStatCard from "../../components/manager/dashboard/KPIStatCard";

export default function ManagerDashboard() {
  const { user } = useAuth();

  const departmentId =
    user?.department_id ||
    user?.department?.id;

  const [summary, setSummary] = useState(null);
  const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const summaryData = await getManagerDashboard();
        setSummary(summaryData);

        if (departmentId) {
          const analyticsData =
            await getManagerAnalytics(departmentId);

          setDepartmentAnalytics(analyticsData);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [departmentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        Loading manager dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-3xl p-8">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Department Employees",
      value:
        departmentAnalytics?.totalEmployees ??
        summary?.employees ??
        0,
      subtitle: "Active employees",
    },
    {
      title: "Total Enrollments",
      value:
        departmentAnalytics?.totalEnrollments ??
        summary?.enrollments ??
        0,
      subtitle: "Course enrollments",
    },
    {
      title: "Completed Training",
      value:
        departmentAnalytics?.completedEnrollments ??
        summary?.completedEnrollments ??
        0,
      subtitle: "Completed enrollments",
    },
    {
      title: "Completion Rate",
      value:
        departmentAnalytics?.completionRate ??
        `${summary?.completionRate ?? 0}%`,
      subtitle: "Department completion rate",
      progress: parseFloat(
        departmentAnalytics?.completionRate ??
        summary?.completionRate ??
        0
      ),
    },
  ];

  const headerData = {
    title: "Manager Dashboard",
    description:
      "Monitor employee learning progress and department training performance.",
    exportButton: "Export Report",
    assignButton: "Assign Training",
  };

  function handleAssignTraining() {
  navigate("/manager/department-training");
}

function handleExportReport() {
  try {
    setExporting(true);

    const rows = [
      ["Metric", "Value"],
      ...stats.map((item) => [
        item.title,
        item.value,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "manager-dashboard-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    alert(
      error?.message ||
        "Gagal mengekspor laporan."
    );
  } finally {
    setExporting(false);
  }
}

  return (
    <div className="space-y-6">
      <DashboardHeader
  data={headerData}
  onExport={handleExportReport}
  onAssign={handleAssignTraining}
  exporting={exporting}
/>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <KPIStatCard
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
