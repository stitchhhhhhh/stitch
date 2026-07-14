import OverviewCards from "../../components/hr/hrDashboard/OverviewCards";
import CompletionChart from "../../components/hr/hrDashboard/CompletionChart";
import EngagementCard from "../../components/hr/hrDashboard/EngagementCard";
import DepartmentComparison from "../../components/hr/hrDashboard/DepartmentComparison";
import RecentActivity from "../../components/hr/hrDashboard/RecentActivity";
import RecentRequestsTable from "../../components/hr/hrDashboard/RecentRequestsTable";

export default function HRDashboard() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#253B80]">
          HR Executive Overview
        </h1>

        <p className="text-gray-500 mt-1">
          Real-time learning metrics and workforce development status.
        </p>
      </div>

      {/* Cards */}
      <OverviewCards />

      {/* Chart + Engagement */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">
          <CompletionChart />
        </div>

        <EngagementCard />

      </div>

      {/* Department + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <DepartmentComparison />

        <RecentActivity />

      </div>

      {/* Table */}
      <RecentRequestsTable />

    </div>
  );
}