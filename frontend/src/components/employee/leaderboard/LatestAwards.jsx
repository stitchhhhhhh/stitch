export default function LatestAwards() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">
        Latest Awards
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Recently unlocked achievements
      </p>

      <div className="flex min-h-[180px] items-center justify-center">
        <div className="text-center">
          <div className="text-3xl">
            🏅
          </div>

          <p className="mt-3 font-semibold text-gray-900">
            No awards yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Complete courses to unlock achievements.
          </p>
        </div>
      </div>
    </section>
  );
}