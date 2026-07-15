import {
  rankings,
} from "./leaderboardData";

import BadgeGroup from "./BadgeGroup";

export default function RankingTable() {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      <div className="p-8 border-b">

        <h2 className="text-2xl font-bold text-[#253B80]">
          Complete Rankings
        </h2>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left px-8 py-4">
              Rank
            </th>

            <th className="text-left px-8 py-4">
              Employee
            </th>

            <th className="text-left px-8 py-4">
              Department
            </th>

            <th className="text-left px-8 py-4">
              Points
            </th>

            <th className="text-left px-8 py-4">
              Badges
            </th>

          </tr>

        </thead>

        <tbody>

          {rankings.map((user) => (

            <tr
              key={user.rank}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-8 py-6 font-bold">

                #{user.rank}

              </td>

              <td className="px-8 py-6">

                <div>

                  <h3 className="font-semibold">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                </div>

              </td>

              <td className="px-8 py-6">

                {user.department}

              </td>

              <td className="px-8 py-6 font-bold text-[#3046D3]">

                {user.points}

              </td>

              <td className="px-8 py-6">

                <BadgeGroup
                  total={user.badges}
                />

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}