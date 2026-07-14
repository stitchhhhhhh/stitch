import {
  BarChart3,
  Download,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Training Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Generate and export training performance reports across the
            organization.
          </p>
        </div>

        <button className="bg-[#2F3FE4] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#2433C7]">
          <Download size={18} />
          Export Report
        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Users className="text-[#2F3FE4]" size={30} />
          <p className="text-gray-500 mt-4">Employees Trained</p>
          <h2 className="text-3xl font-bold mt-1">1,248</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <BookOpen className="text-green-600" size={30} />
          <p className="text-gray-500 mt-4">Courses Completed</p>
          <h2 className="text-3xl font-bold mt-1">324</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <GraduationCap className="text-orange-500" size={30} />
          <p className="text-gray-500 mt-4">Certificates Issued</p>
          <h2 className="text-3xl font-bold mt-1">289</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <TrendingUp className="text-purple-600" size={30} />
          <p className="text-gray-500 mt-4">Completion Rate</p>
          <h2 className="text-3xl font-bold mt-1">91%</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between">

            <h2 className="font-bold text-xl">
              Monthly Training Activity
            </h2>

            <BarChart3 className="text-[#2F3FE4]" />

          </div>

          <div className="h-72 flex items-center justify-center text-gray-400">

            Monthly Chart (Chart.js / Recharts)

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="font-bold text-xl mb-6">
            Top Departments
          </h2>

          <div className="space-y-5">

            <div>
              <div className="flex justify-between">
                <span>IT</span>
                <span>95%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-2 w-[95%] rounded-full bg-[#2F3FE4]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>Finance</span>
                <span>88%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-2 w-[88%] rounded-full bg-green-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>HR</span>
                <span>84%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-2 w-[84%] rounded-full bg-orange-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>Marketing</span>
                <span>76%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-2 w-[76%] rounded-full bg-pink-500" />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Reports */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-6">
          Recent Reports
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Report</th>
              <th className="text-left">Department</th>
              <th className="text-left">Generated</th>
              <th className="text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-b">
              <td className="py-4">Q2 Training Summary</td>
              <td>All Departments</td>
              <td>July 12, 2026</td>
              <td>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Completed
                </span>
              </td>
            </tr>

            <tr className="border-b">
              <td className="py-4">Cyber Security Report</td>
              <td>IT</td>
              <td>July 10, 2026</td>
              <td>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Exported
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-4">Leadership Progress</td>
              <td>Management</td>
              <td>July 8, 2026</td>
              <td>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  Pending
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}