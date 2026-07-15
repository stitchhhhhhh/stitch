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

import { analyticsStats } from "../../components/manager/analytics/analyticsData";

export default function Analytics() {
  return (
    <div className="space-y-6">

      {/* Header */}

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

      {/* Statistics */}

      <div className="grid grid-cols-4 gap-6">

        {analyticsStats.map((item, index) => (

          <AnalyticsStatCard
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
          />

        ))}

      </div>

      {/* Middle Section */}

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8">

          <CompletionTrendChart />

        </div>

        <div className="col-span-4 space-y-6">

          <AnalyticsFilters />

          <TopPrograms />

        </div>

      </div>

      {/* Second Section */}

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-4">

          <AssessmentScores />

        </div>

        <div className="col-span-4">

          <CompletionStatus />

        </div>

        <div className="col-span-4">

          <UpcomingDeadlines />

        </div>

      </div>

      {/* Bottom */}

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8 space-y-6">

          <EmployeeTrendChart />

          <PerformanceSummary />

        </div>

        <div className="col-span-4">

          <RecentActivities />

        </div>

      </div>

    </div>
  );
}