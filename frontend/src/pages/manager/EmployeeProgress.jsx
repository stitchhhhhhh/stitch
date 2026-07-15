import ProgressStatCard from "../../components/manager/employeeProgress/ProgressStatCard";
import EmployeeProgressTable from "../../components/manager/employeeProgress/EmployeeProgressTable";
import TopPerformers from "../../components/manager/employeeProgress/TopPerformers";
import UpcomingDeadlines from "../../components/manager/employeeProgress/UpcomingDeadlines";
import RecentActivities from "../../components/manager/employeeProgress/RecentActivities";

import {
  progressStats,
  employees,
} from "../../components/manager/employeeProgress/progressData";

export default function EmployeeProgress() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>

          <h1 className="text-4xl font-bold text-[#253B80]">
            Employee Progress
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor employee learning progress and training completion.
          </p>

        </div>

        <button className="bg-[#4453F2] text-white px-5 py-3 rounded-xl hover:bg-[#3442d9] transition">

          Export Report

        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6">

        {progressStats.map((item, index) => (

          <ProgressStatCard
            key={index}
            {...item}
          />

        ))}

      </div>

      {/* Filter */}
      <div className="bg-white rounded-3xl shadow-sm p-5 flex justify-between items-center">

        <div className="flex gap-4">

          <select className="border rounded-xl px-4 py-2">

            <option>All Courses</option>

          </select>

          <select className="border rounded-xl px-4 py-2">

            <option>Training Status</option>

          </select>

          <select className="border rounded-xl px-4 py-2">

            <option>Completion Status</option>

          </select>

        </div>

        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded-xl px-4 py-2 w-64"
        />

      </div>

      {/* Main Content */}

      <div className="grid grid-cols-12 gap-6">

        {/* Table */}

        <div className="col-span-8">

          <EmployeeProgressTable
            employees={employees}
          />

        </div>

        {/* Sidebar */}

        <div className="col-span-4 space-y-6">

          <TopPerformers />

          <UpcomingDeadlines />

          <RecentActivities />

        </div>

      </div>

    </div>
  );
}