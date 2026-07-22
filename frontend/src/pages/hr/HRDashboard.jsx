import { useEffect, useState } from "react";

import OverviewCards from "../../components/hr/hrDashboard/OverviewCards";
import CompletionChart from "../../components/hr/hrDashboard/CompletionChart";
import EngagementCard from "../../components/hr/hrDashboard/EngagementCard";
import DepartmentComparison from "../../components/hr/hrDashboard/DepartmentComparison";
import RecentActivity from "../../components/hr/hrDashboard/RecentActivity";
import RecentRequestsTable from "../../components/hr/hrDashboard/RecentRequestsTable";

import { getCompanyAnalytics } from "../../services/hrService";
import { getDashboardSummary } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
export default function HRDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [analyticsData, summaryData] =
          await Promise.all([
            getCompanyAnalytics(),
            getDashboardSummary(),
          ]);

        setAnalytics(analyticsData);
        setSummary(summaryData);
      } catch (err) {
        setError(
          err.message ||
          "Gagal mengambil data HR Dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        Loading HR dashboard...
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#253B80]">
          HR Executive Overview
        </h1>

        <p className="text-gray-500 mt-1">
          Real-time learning metrics and workforce
          development status.
        </p>
      </div>

      <OverviewCards
        analytics={analytics}
        summary={summary}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CompletionChart
  totalEnrollments={
    analytics?.totalEnrollments ??
    summary?.enrollments ??
    0
  }
  completedEnrollments={
    analytics?.completedEnrollments ??
    summary?.completedEnrollments ??
    0
  }
/>
        </div>

        <EngagementCard
  completionRate={
    analytics?.completionRate ??
    summary?.completionRate ??
    0
  }
  averageScore={
    analytics?.averageAssessmentScore ??
    summary?.averageScore ??
    0
  }
/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DepartmentComparison />
        <RecentActivity />
      </div>

      <RecentRequestsTable
  onViewAll={() =>
    navigate("/hr/course-requests")
  }
/>
    </div>
  );
}
