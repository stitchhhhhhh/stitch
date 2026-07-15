import { recentActivities } from "./courseData";

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5">

        {recentActivities.map((item) => (

          <div
            key={item.title}
            className="flex gap-4"
          >

            <div className="w-3 h-3 rounded-full bg-[#3046D3] mt-2" />

            <div>

              <h3 className="font-semibold">

                {item.title}

              </h3>

              <p className="text-gray-500 text-sm mt-1">

                {item.time}

              </p>

            </div>

          </div>

        ))}

      </div>

      <button className="mt-6 text-[#3046D3] font-semibold hover:underline">

        View All Activities

      </button>

    </div>
  );
}