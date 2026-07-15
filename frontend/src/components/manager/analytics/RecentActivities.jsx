import { recentActivities } from "./analyticsData";

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-lg font-bold text-[#253B80] mb-5">
        Recent Activities
      </h2>

      <div className="space-y-5">

        {recentActivities.map((item, index) => (

          <div
            key={index}
            className="border-b pb-3"
          >

            <p className="font-medium">

              {item.title}

            </p>

            <p className="text-sm text-gray-500">

              {item.time}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}