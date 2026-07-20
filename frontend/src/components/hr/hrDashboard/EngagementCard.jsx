export default function EngagementCard({
  completionRate = 0,
  averageScore = 0,
}) {
  const rate = parseFloat(completionRate) || 0;
  const score = Number(averageScore) || 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-lg font-semibold">
        Learning Engagement
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Current workforce learning performance
      </p>

      <div className="mt-10 flex flex-col items-center">
        <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-[#2F3FE4]">
              {rate.toFixed(1)}%
            </span>

            <span className="text-xs text-gray-500 mt-1">
              Completion
            </span>
          </div>
        </div>

        <div className="w-full mt-10 border-t pt-6">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Average Assessment Score
            </span>

            <span className="font-semibold text-gray-800">
              {score.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
