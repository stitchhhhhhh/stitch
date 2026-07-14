import { Download, Eye } from "lucide-react";

const rows = [
  {
    department: "Strategy & Operations",
    learners: 342,
    completion: 98,
    score: 94.5,
    status: "Exceptional",
  },
  {
    department: "Product Engineering",
    learners: 415,
    completion: 82,
    score: 88.2,
    status: "On Track",
  },
  {
    department: "Global Sales",
    learners: 289,
    completion: 74,
    score: 79.5,
    status: "Improving",
  },
  {
    department: "Finance & Tax",
    learners: 194,
    completion: 61,
    score: 72.0,
    status: "At Risk",
  },
];

function badge(status) {
  switch (status) {
    case "Exceptional":
      return "bg-indigo-100 text-indigo-700";
    case "On Track":
      return "bg-green-100 text-green-700";
    case "Improving":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function DepartmentTable() {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      {/* Header */}

      <div className="flex justify-between items-center p-8">

        <div>

          <h2 className="text-2xl font-semibold">
            Training Statistics by Department
          </h2>

          <p className="text-gray-500 mt-2">
            Detailed performance audit across all active units
          </p>

        </div>

        <button className="flex items-center gap-2 border rounded-xl px-5 py-3 hover:bg-gray-50">

          <Download size={18} />

          Export CSV

        </button>

      </div>

      {/* Table */}

      <table className="w-full">

        <thead className="bg-[#F7F8FD]">

          <tr className="text-left">

            <th className="px-6 py-5">Department Name</th>

            <th>Total Learners</th>

            <th>Completion %</th>

            <th>Average Score</th>

            <th>Status</th>

            <th className="text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((item) => (

            <tr
              key={item.department}
              className="border-t hover:bg-[#FAFBFF]"
            >

              <td className="px-6 py-6 font-semibold">
                {item.department}
              </td>

              <td>{item.learners}</td>

              <td>

                <div className="flex items-center gap-4">

                  <div className="w-24 h-2 rounded-full bg-[#EEF2FF]">

                    <div
                      className="bg-[#2F3FE4] h-2 rounded-full"
                      style={{
                        width: `${item.completion}%`,
                      }}
                    />

                  </div>

                  <span className="font-semibold">
                    {item.completion}%
                  </span>

                </div>

              </td>

              <td className="font-semibold">
                {item.score}
              </td>

              <td>

                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold ${badge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

              </td>

              <td>

                <div className="flex justify-center">

                  <button className="text-[#2F3FE4] hover:scale-110 duration-200">

                    <Eye size={20} />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}