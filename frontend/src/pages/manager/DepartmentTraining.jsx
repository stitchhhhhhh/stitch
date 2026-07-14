import KPIStatCard from "../../components/manager/departmentTraining/KPIStatCard";
import CoursePipelineCard from "../../components/manager/departmentTraining/CoursePipelineCard";
import UpcomingDeadlines from "../../components/manager/departmentTraining/UpcomingDeadlines";
import RecentActivities from "../../components/manager/departmentTraining/RecentActivities";
import TrainerCapacity from "../../components/manager/departmentTraining/TrainerCapacity";

import {
  stats,
  courses,
} from "../../components/manager/departmentTraining/departmentTrainingData";

export default function DepartmentTraining() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-indigo-700">
            Department Training
          </h1>

          <p className="text-gray-500 mt-2">
            Manage IT department training programs and course development.
          </p>

        </div>

        <button className="px-6 py-3 bg-gray-100 rounded-xl">
          Quarter 4, 2023
        </button>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item, index) => (
          <KPIStatCard
            key={index}
            {...item}
          />
        ))}

      </div>

      {/* Body */}

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="col-span-2 space-y-6">

          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-semibold">
              Course Lifecycle Pipeline
            </h2>

            <div className="flex gap-3">

              <button className="w-10 h-10 rounded-lg border">
                ☰
              </button>

              <button className="w-10 h-10 rounded-lg border">
                ⊞
              </button>

            </div>

          </div>

          {courses.map((course, index) => (
            <CoursePipelineCard
              key={index}
              course={course}
            />
          ))}

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          <UpcomingDeadlines />

          <RecentActivities />

          <TrainerCapacity />

        </div>

      </div>

    </div>
  );
}