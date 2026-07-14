import { requests } from "./dashboardData";

export default function CourseRequestsTable() {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">

        <div>
          <h2 className="text-2xl font-bold text-[#253B80]">
            Recent Course Requests
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Latest requests submitted by HR and Managers
          </p>
        </div>

        <button className="text-[#3046D3] font-semibold hover:underline">
          View All
        </button>

      </div>

      {/* Table */}

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left text-gray-500 text-sm">

            <th className="px-6 py-4">
              Course
            </th>

            <th className="px-6 py-4">
              Requester
            </th>

            <th className="px-6 py-4">
              Priority
            </th>

            <th className="px-6 py-4">
              Date
            </th>

            <th className="px-6 py-4 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {requests.map((item) => (

            <tr
              key={item.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-6 py-5 font-semibold">
                {item.course}
              </td>

              <td className="px-6 py-5">
                {item.requester}
              </td>

              <td className="px-6 py-5">

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : item.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {item.priority}
                </span>

              </td>

              <td className="px-6 py-5 text-gray-500">
                {item.date}
              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <button
                    className="
                      px-4
                      py-2
                      rounded-lg
                      border
                      hover:bg-gray-100
                    "
                  >
                    View
                  </button>

                  <button
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-[#3046D3]
                      text-white
                      hover:bg-[#253B80]
                    "
                  >
                    Accept
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