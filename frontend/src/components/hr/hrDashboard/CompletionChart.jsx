export default function CompletionChart({
  totalEnrollments = 0,
  completedEnrollments = 0,
}) {
  const enrolled = Number(totalEnrollments) || 0;
  const completed = Number(completedEnrollments) || 0;

  const completionRate =
    enrolled > 0
      ? Math.min((completed / enrolled) * 100, 100)
      : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <div>
        <h2 className="text-lg font-semibold">
          Company-wide Training Completion
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Current completed and enrolled training totals
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <div className="flex justify-between mb-3">
            <span className="font-medium text-gray-700">
              Completed
            </span>

            <span className="font-semibold text-[#2F3FE4]">
              {completed}
            </span>
          </div>

          <div className="h-4 rounded-full bg-indigo-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2F3FE4]"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-3">
            <span className="font-medium text-gray-700">
              Total Enrollments
            </span>

            <span className="font-semibold text-gray-700">
              {enrolled}
            </span>
          </div>

          <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-300"
              style={{
                width: enrolled > 0 ? "100%" : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
