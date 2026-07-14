import { topPerformers } from "./progressData";

export default function TopPerformers() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold text-[#253B80]">
          Top Performers
        </h2>

        <button className="text-sm text-[#4453F2]">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {topPerformers.map((item, index) => (

          <div
            key={index}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-[#4453F2]">

                {item.name.charAt(0)}

              </div>

              <div>

                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Training Score
                </p>

              </div>

            </div>

            <span className="font-bold text-green-600">

              {item.score}%

            </span>

          </div>

        ))}

      </div>

    </div>
  );
}