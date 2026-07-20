export default function PerformanceSummary({
  totalEnrollments = 0,
  completedEnrollments = 0,
  completionRate = 0,
}) {
  const formattedCompletionRate =
    typeof completionRate === "string" &&
    completionRate.includes("%")
      ? completionRate
      : `${completionRate || 0}%`;

  return (
    <div className="bg-[#4453F2] text-white rounded-3xl p-8 shadow-lg">
      <h2 className="text-xl font-bold mb-8">
        Performance Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-blue-100 text-sm">
            TOTAL ENROLLMENTS
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {totalEnrollments}
          </h3>
        </div>

        <div>
          <p className="text-blue-100 text-sm">
            COMPLETED
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {completedEnrollments}
          </h3>
        </div>

        <div>
          <p className="text-blue-100 text-sm">
            COMPLETION RATE
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {formattedCompletionRate}
          </h3>
        </div>
      </div>
    </div>
  );
}
