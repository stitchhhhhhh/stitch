import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import OverviewCards from "../../components/hr/hrDashboard/OverviewCards";
import CompletionChart from "../../components/hr/hrDashboard/CompletionChart";
import EngagementCard from "../../components/hr/hrDashboard/EngagementCard";
import DepartmentComparison from "../../components/hr/hrDashboard/DepartmentComparison";
import RecentActivity from "../../components/hr/hrDashboard/RecentActivity";
import RecentRequestsTable from "../../components/hr/hrDashboard/RecentRequestsTable";

import { getHROverview } from "../../services/hrService";

export default function HRDashboard() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getHROverview();

        if (isMounted) {
          setOverview(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load the HR dashboard."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
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
        <p className="font-semibold">Unable to load the HR dashboard.</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  const summary = overview?.summary ?? {};
  const departments = overview?.departments ?? [];
  const activities = overview?.recentActivities ?? [];
  const requests = overview?.recentRequests ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#253B80]">
          HR Executive Overview
        </h1>

        <p className="text-gray-500 mt-1">
          Real-time learning metrics and workforce development status.
        </p>
      </div>

      <OverviewCards summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CompletionChart
            totalEnrollments={summary.totalEnrollments ?? 0}
            completedEnrollments={summary.completedEnrollments ?? 0}
          />
        </div>

        <EngagementCard
          completionRate={summary.completionRate ?? 0}
          averageScore={summary.averageAssessmentScore ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DepartmentComparison departments={departments} />
        <RecentActivity activities={activities} />
      </div>

      <RecentRequestsTable
        requests={requests}
        onViewAll={() => navigate("/hr/course-requests")}
      />
    </div>
  );
}