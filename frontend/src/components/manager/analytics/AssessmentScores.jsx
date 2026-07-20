export default function AssessmentScores({
  results = [],
}) {
  const assessmentResults = Array.isArray(results)
    ? results.slice(0, 5)
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="font-bold text-xl text-[#253B80] mb-6">
        Assessment Scores
      </h2>

      {assessmentResults.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          No assessment results available.
        </div>
      ) : (
        <div className="space-y-5">
          {assessmentResults.map((item) => {
            const score = Math.max(
              0,
              Math.min(100, Number(item.score) || 0)
            );

            return (
              <div key={item.id}>
                <div className="flex justify-between gap-4 mb-2">
                  <span className="truncate">
                    {item.assessment?.title ||
                      "Untitled Assessment"}
                  </span>

                  <span className="font-bold">
                    {Math.round(score)}%
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-3 rounded-full bg-[#4453F2]"
                    style={{
                      width: `${score}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
