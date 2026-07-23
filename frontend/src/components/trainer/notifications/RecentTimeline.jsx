export default function RecentTimeline({
  timeline = [],
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-8 text-2xl font-bold text-[#253B80]">
        Recent Activity
      </h2>

      {timeline.length === 0 ? (
        <p className="text-gray-500">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-[#3046D3]" />

                {index !== timeline.length - 1 && (
                  <div className="mt-1 h-16 w-[2px] bg-gray-300" />
                )}
              </div>

              <div>
                <h3 className="font-bold">
                  {item.title}
                </h3>

                <p className="mt-1 text-gray-500">
                  {item.desc}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#3046D3]">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
