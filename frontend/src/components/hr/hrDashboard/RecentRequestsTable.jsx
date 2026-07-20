const requests = [
  {
    employee: "James Anderson",
    course: "Advanced React Patterns",
    department: "Engineering",
    date: "Oct 12, 2023",
  },
  {
    employee: "Lisa Ray",
    course: "Strategic Marketing",
    department: "Marketing",
    date: "Oct 11, 2023",
  },
  {
    employee: "David Kovac",
    course: "Data Science Fundamentals",
    department: "Analytics",
    date: "Oct 10, 2023",
  },
];

export default function RecentRequestsTable({
  onViewAll,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-xl font-semibold">
          Recent Course Requests
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[#2F3FE4] font-semibold hover:underline"
        >
          View All Requests
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="text-left text-gray-500 border-b">

              <th className="pb-4">Employee</th>
              <th className="pb-4">Requested Course</th>
              <th className="pb-4">Department</th>
              <th className="pb-4">Date</th>
              <th className="pb-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {requests.map((item) => (

              <tr
                key={item.employee}
                className="border-b"
              >

                <td className="py-5 font-medium">
                  {item.employee}
                </td>

                <td>{item.course}</td>

                <td>{item.department}</td>

                <td>{item.date}</td>

                <td>

                  <div className="flex justify-center gap-3">

                    <button
                      type="button"
                      className="bg-[#2F3FE4] text-white px-5 py-2 rounded-xl"
                    >
                      Approve
                    </button>

                    <button
  type="button"
  onClick={onViewAll}
  className="bg-gray-200 px-5 py-2 rounded-xl"
>
  Reject
</button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}