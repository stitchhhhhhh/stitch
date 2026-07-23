export default function ProgressSection() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Your Progress
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Complete courses to earn points and improve your ranking.
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-brand-600">
            -
          </p>

          <p className="text-sm text-gray-500">
            Global Ranking
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">
            Beginner
          </span>

          <span className="text-gray-500">
            0 points
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-0 rounded-full bg-brand-600" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-500">
            Recent Badge
          </p>

          <p className="mt-2 font-semibold text-gray-900">
            No badge yet
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">
            0
          </p>

          <p className="text-xs text-gray-500">
            Rank Jump
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">
            0
          </p>

          <p className="text-xs text-gray-500">
            This Week
          </p>
        </div>
      </div>
    </section>
  );
}