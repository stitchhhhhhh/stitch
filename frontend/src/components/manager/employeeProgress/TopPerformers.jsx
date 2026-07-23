export default function TopPerformers({
  performers = [],
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Top Performers
      </h2>

      <div className="space-y-5">
        {performers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No performer data available.
          </p>
        ) : (
          performers.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-[#4453F2]">
                  {item.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Average Progress
                  </p>
                </div>
              </div>

              <span className="font-bold text-green-600">
                {item.progress}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}