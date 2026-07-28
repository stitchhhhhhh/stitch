import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getManagerAnalytics,
  getRecentAssessmentResults,
  getPrograms,
  getCourses,
} from "../../services/managerService";

import AnalyticsStatCard from "../../components/manager/analytics/AnalyticsStatCard";
import AnalyticsFilters from "../../components/manager/analytics/AnalyticsFilters";
import CompletionTrendChart from "../../components/manager/analytics/CompletionTrendChart";
import AssessmentScores from "../../components/manager/analytics/AssessmentScores";
import CompletionStatus from "../../components/manager/analytics/CompletionStatus";
import TopPrograms from "../../components/manager/analytics/TopPrograms";
import UpcomingDeadlines from "../../components/manager/analytics/UpcomingDeadlines";
import RecentActivities from "../../components/manager/analytics/RecentActivities";
import PerformanceSummary from "../../components/manager/analytics/PerformanceSummary";
import EmployeeTrendChart from "../../components/manager/analytics/EmployeeTrendChart";

export default function Analytics() {
  const { user } = useAuth();

  const departmentId =
    user?.department_id ||
    user?.department?.id;

  const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        if (!departmentId) {
          throw new Error("Department ID was not found");
        }

        const [
          departmentData,
          assessmentData,
          programData,
          courseData,
        ] = await Promise.all([
          getManagerAnalytics(departmentId),
          getRecentAssessmentResults(),
          getPrograms(),
          getCourses(),
        ]);

        setDepartmentAnalytics(departmentData);

        setAssessmentResults(
          Array.isArray(assessmentData)
            ? assessmentData
            : []
        );

        setPrograms(
          Array.isArray(programData)
            ? programData
            : []
        );

        setCourses(
          Array.isArray(courseData)
            ? courseData
            : []
        );
      } catch (err) {
        setError(err.message || "Failed to load department analytics");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [departmentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        Loading department analytics...
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

  const analyticsStats = [
    {
      title: "Dept Completion Rate",
      value: departmentAnalytics?.completionRate ?? "0%",
      subtitle: "Department completion rate",
    },
    {
      title: "Department Employees",
      value: departmentAnalytics?.totalEmployees ?? 0,
      subtitle: "Active employees",
    },
    {
      title: "Total Enrollments",
      value: departmentAnalytics?.totalEnrollments ?? 0,
      subtitle: "Course enrollments",
    },
    {
      title: "Completed Training",
      value: departmentAnalytics?.completedEnrollments ?? 0,
      subtitle: "Completed enrollments",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm p-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Department Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Analyze department learning performance and outcomes.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="border rounded-xl px-5 py-3 bg-white">
            Last 6 Months
          </button>

          <button className="bg-[#4453F2] text-white rounded-xl px-6 py-3">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {analyticsStats.map((item) => (
          <AnalyticsStatCard
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <CompletionTrendChart
  trend={
    departmentAnalytics?.completionTrend ?? []
  }
/>
        </div>

        <div className="col-span-4 space-y-6">
          <AnalyticsFilters />
          <TopPrograms programs={programs} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <AssessmentScores
            results={assessmentResults}
          />
        </div>

        <div className="col-span-4">
          <CompletionStatus
            totalEnrollments={
              departmentAnalytics?.totalEnrollments ?? 0
            }
            completedEnrollments={
              departmentAnalytics?.completedEnrollments ?? 0
            }
          />
        </div>

        <div className="col-span-4">
          <UpcomingDeadlines courses={courses} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <EmployeeTrendChart
  trend={
    departmentAnalytics
      ?.employeeParticipationTrend ?? []
  }
/>

          <PerformanceSummary
            totalEnrollments={
              departmentAnalytics?.totalEnrollments ?? 0
            }
            completedEnrollments={
              departmentAnalytics?.completedEnrollments ?? 0
            }
            completionRate={
              departmentAnalytics?.completionRate ?? 0
            }
          />
        </div>

        <div className="col-span-4">
          <RecentActivities
  activities={assessmentResults}
/>
        </div>
      </div>
    </div>
  );
}
