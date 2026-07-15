import { activities } from "./progressData";

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold text-[#253B80]">
          Recent Activities
        </h2>

        <button className="text-sm text-[#4453F2]">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-3"
          >

            <div className="mt-2 w-2 h-2 rounded-full bg-[#4453F2]" />

            <div>

              <p className="text-sm text-gray-700">
                {item.title}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}