import { topPrograms } from "./analyticsData";

export default function TopPrograms() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-lg font-bold text-[#253B80] mb-5">
        Top Programs
      </h2>

      <div className="space-y-4">

        {topPrograms.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>

              <p className="font-semibold">

                {index + 1}. {item.name}

              </p>

              <p className="text-sm text-gray-500">

                {item.completion} Completion

              </p>

            </div>

            <span className="text-green-500 text-xl">

              ↗

            </span>

          </div>

        ))}

      </div>

    </div>
  );
}