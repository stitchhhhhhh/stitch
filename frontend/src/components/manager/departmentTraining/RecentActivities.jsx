function formatActivityDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentActivities({
  activities = [],
}) {
  const safeActivities = Array.isArray(activities)
    ? activities
    : [];

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">
        Recent Activities
      </h2>

      {safeActivities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No recent activities.
        </p>
      ) : (
        <div className="space-y-6">
          {safeActivities.map((item) => (
            <div
              key={
                item.courseId ||
                `${item.text}-${item.createdDate}`
              }
              className="flex gap-4"
            >
              <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-indigo-600" />

              <div>
                <p className="text-gray-700">
                  {item.text ||
                    "Course activity updated."}
                </p>

                {item.createdDate && (
                  <p className="mt-1 text-sm text-gray-400">
                    {formatActivityDate(
                      item.createdDate
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
