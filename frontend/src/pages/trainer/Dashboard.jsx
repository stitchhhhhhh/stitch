import StatCard from "../../components/trainer/dashboard/StatCard";
import {
  stats,
} from "../../components/trainer/dashboard/dashboardData";

import CourseRequestsTable from "../../components/trainer/dashboard/CourseRequestsTable";
import DevelopmentPipeline from "../../components/trainer/dashboard/DevelopmentPipeline";
import RecentMaterials from "../../components/trainer/dashboard/RecentMaterials";
import RecentActivity from "../../components/trainer/dashboard/RecentActivity";

export default function TrainerDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-[#253B80]">
            Trainer Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage course development, training requests, and learning materials.
          </p>

        </div>

        <div className="flex gap-4">

          <button
            className="
              border
              px-6
              py-3
              rounded-xl
              bg-white
              hover:bg-gray-100
            "
          >
            Upload Material
          </button>

          <button
            className="
              bg-[#3046D3]
              hover:bg-[#253B80]
              text-white
              px-6
              py-3
              rounded-xl
            "
          >
            Create Course
          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item) => (

          <StatCard
            key={item.title}
            {...item}
          />

        ))}

      </div>

      {/* Middle Section */}

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">

          <CourseRequestsTable />

        </div>

        <DevelopmentPipeline />

      </div>

      {/* Bottom Section */}

      <div className="grid grid-cols-2 gap-6">

        <RecentMaterials />

        <RecentActivity />

      </div>

    </div>
  );
}