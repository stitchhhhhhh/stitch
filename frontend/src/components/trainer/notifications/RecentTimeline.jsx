import { timeline } from "./notificationsData";

export default function RecentTimeline() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-2xl font-bold text-[#253B80] mb-8">

        Recent Activity

      </h2>

      <div className="space-y-8">

        {timeline.map((item, index) => (

          <div
            key={item.title}
            className="flex gap-5"
          >

            <div className="flex flex-col items-center">

              <div className="w-4 h-4 rounded-full bg-[#3046D3]" />

              {index !== timeline.length - 1 && (
                <div className="w-[2px] h-16 bg-gray-300 mt-1" />
              )}

            </div>

            <div>

              <h3 className="font-bold">

                {item.title}

              </h3>

              <p className="text-gray-500 mt-1">

                {item.desc}

              </p>

              <p className="text-xs text-[#3046D3] mt-2 font-semibold">

                {item.time}

              </p>

            </div>

          </div>

        ))}

      </div>

      <button className="w-full mt-8 border rounded-xl py-3 hover:bg-gray-100 transition">

        View Full History

      </button>

    </div>
  );
}