import { completionData } from "./dashboardData";

export default function CompletionChart() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">
          Company-wide Completion Trends
        </h2>

        <div className="flex gap-6 text-sm">

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2F3FE4]" />
            Completed
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-200" />
            Enrolled
          </div>

        </div>

      </div>

      <div className="mt-12 h-72 flex items-end justify-around border-b">

        {completionData.map((item) => (

          <div
            key={item.month}
            className="flex flex-col items-center"
          >

            <div
              className="w-12 bg-[#2F3FE4] rounded-t-xl hover:bg-indigo-700 transition"
              style={{
                height: `${item.completed * 2}px`,
              }}
            />

            <span className="mt-4 text-gray-600">
              {item.month}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}