import { deadlines } from "./progressData";

export default function UpcomingDeadlines() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Upcoming Deadlines
      </h2>

      <div className="space-y-5">

        {deadlines.map((item, index) => (

          <div
            key={index}
            className="border-b last:border-none pb-4"
          >

            <h3 className="font-semibold">
              {item.name}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {item.course}
            </p>

            <p className="text-red-500 text-sm mt-2">
              {item.due}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}