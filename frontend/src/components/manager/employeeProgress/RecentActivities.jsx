function formatRelativeTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const difference =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    difference / 60000
  );

  const hours = Math.floor(
    difference / 3600000
  );

  const days = Math.floor(
    difference / 86400000
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export default function RecentActivities({
  activities = [],
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent activities.
          </p>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="flex gap-3"
            >
              <div className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#4453F2]" />

              <div>
                <p className="text-sm text-gray-700">
                  {item.name} was assigned
                  to {item.training}.
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(
                    item.assignedDate
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}