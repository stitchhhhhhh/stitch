import { activities } from "./departmentTrainingData";

export default function RecentActivities() {

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Recent Activities
      </h2>

      <div className="space-y-6">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="w-3 h-3 rounded-full bg-indigo-600 mt-2" />

            <div>

              <p className="text-gray-700">
                {item.text}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}