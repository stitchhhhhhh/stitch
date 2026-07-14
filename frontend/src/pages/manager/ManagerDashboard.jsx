import { useAuth } from "../../context/AuthContext";
import managerDashboardData from "../../data/managerDashboardData";

import DashboardHeader from "../../components/manager/dashboard/DashboardHeader";
import KPIStatCard from "../../components/manager/dashboard/KPIStatCard";
import CompletionTrendChart from "../../components/manager/dashboard/CompletionTrendChart";
import UpcomingDeadlines from "../../components/manager/dashboard/UpcomingDeadlines";
import ProgramPerformance from "../../components/manager/dashboard/ProgramPerformance";
import RecentActivities from "../../components/manager/dashboard/RecentActivities";
import TopPerformers from "../../components/manager/dashboard/TopPerformers";

export default function ManagerDashboard() {
  const { user } = useAuth();

  // sementara default IT
  // nanti tinggal ambil dari backend
  const department =
    user?.department ||
    user?.department_name ||
    "IT";

  const data =
    managerDashboardData[department] ||
    managerDashboardData.IT;

  return (
    <div className="space-y-6">

      <DashboardHeader data={data} />

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {data.stats.map((item, index) => (
          <KPIStatCard
            key={index}
            item={item}
          />
        ))}
      </div>

      {/* Chart + Deadline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">
          <CompletionTrendChart />
        </div>

        <UpcomingDeadlines
          deadlines={data.deadlines}
        />

      </div>

      {/* Performance + Activities */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <ProgramPerformance
          performance={data.performance}
        />

        <RecentActivities
          activities={data.activities}
        />

      </div>

      {/* Top Performer */}

      <TopPerformers
        title={data.performersTitle}
        performers={data.performers}
      />

    </div>
  );
}