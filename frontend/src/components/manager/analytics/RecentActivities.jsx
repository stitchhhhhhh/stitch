function formatRelativeTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function RecentActivities({
  activities = [],
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#253B80] mb-5">
        Recent Activities
      </h2>

      <div className="space-y-5">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent activities available.
          </p>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="border-b pb-3"
            >
              <p className="font-medium">
                {(item.user?.full_name ||
                  item.user?.name ||
                  "Unknown User") +
                  " completed " +
                  (item.assessment?.title ||
                    "Assessment")}
              </p>

              <p className="text-sm text-gray-500">
                {formatRelativeTime(
                  item.completed_date
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}