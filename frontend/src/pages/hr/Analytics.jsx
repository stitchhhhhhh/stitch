import AnalyticsStats from "../../components/hr/analytics/AnalyticsStats";
import MonthlyTrendChart from "../../components/hr/analytics/MonthlyTrendChart";
import CourseStatistics from "../../components/hr/analytics/CourseStatistics";
import DepartmentPerformance from "../../components/hr/analytics/DepartmentPerformance";
import EngagementCard from "../../components/hr/analytics/EngagementCard";
import TopDepartment from "../../components/hr/analytics/TopDepartment";
import DailyActivityChart from "../../components/hr/analytics/DailyActivityChart";
import DepartmentTable from "../../components/hr/analytics/DepartmentTable";

export default function Analytics() {
  return (
    <div className="space-y-8">

      <AnalyticsStats />

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8">
          <MonthlyTrendChart />
        </div>

        <div className="col-span-4">
          <CourseStatistics />
        </div>

      </div>

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-6">
          <DepartmentPerformance />
        </div>

        <div className="col-span-3">
          <EngagementCard />
        </div>

        <div className="col-span-3 space-y-6">
          <TopDepartment />
          <DailyActivityChart />
        </div>

      </div>

      <DepartmentTable />

    </div>
  );
}