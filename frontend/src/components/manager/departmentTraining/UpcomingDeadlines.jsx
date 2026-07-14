import { deadlines } from "./departmentTrainingData";

export default function UpcomingDeadlines() {

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="font-bold text-xl mb-6">
        Upcoming Deadlines
      </h2>

      <div className="space-y-6">

        {deadlines.map((item, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex flex-col justify-center items-center">

              <div className="text-xs">
                {item.month}
              </div>

              <div className="font-bold">
                {item.day}
              </div>

            </div>

            <div>

              <h4 className="font-semibold">
                {item.title}
              </h4>

              <p className="text-sm text-gray-500">
                {item.subtitle}
              </p>

            </div>

          </div>

        ))}

      </div>

      <button className="text-indigo-600 font-semibold mt-8">
        View All Dates
      </button>

    </div>

  );
}