import { deadlines } from "./analyticsData";

export default function UpcomingDeadlines() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-lg font-bold text-[#253B80] mb-5">
        Upcoming Deadlines
      </h2>

      <div className="space-y-5">

        {deadlines.map((item, index) => (

          <div key={index}>

            <p className="font-semibold">

              {item.course}

            </p>

            <p className="text-sm text-red-500">

              {item.due}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}