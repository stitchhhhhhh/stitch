export default function EmployeeProgressTable({
  employees,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left">

            <th className="p-5">Employee</th>

            <th>Training</th>

            <th>Progress</th>

            <th>Score</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {employees.map((emp) => (

            <tr
              key={emp.name}
              className="border-t"
            >

              <td className="p-5">

                <div>

                  <h3 className="font-semibold">
                    {emp.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {emp.role}
                  </p>

                </div>

              </td>

              <td>{emp.training}</td>

              <td className="w-64">

                <div className="flex items-center gap-3">

                  <span className="text-sm">
                    {emp.progress}%
                  </span>

                  <div className="flex-1 h-2 rounded bg-gray-200">

                    <div
                      className="bg-[#4453F2] h-2 rounded"
                      style={{
                        width: `${emp.progress}%`,
                      }}
                    />

                  </div>

                </div>

              </td>

              <td>{emp.score}</td>

              <td>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">

                  {emp.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}