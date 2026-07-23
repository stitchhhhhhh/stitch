export default function ActivityCard({
  activity,
  onPrimary,
  onSecondary,
  updating = false,
}) {
  return (
    <div
      className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
        activity.isRead
          ? "border-gray-100 opacity-80"
          : "border-blue-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${activity.badgeColor}`}
        >
          {activity.badge}
        </span>

        <span className="text-sm text-gray-500">
          {activity.time}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-[#253B80]">
          {activity.title}
        </h3>

        <p className="mt-2 text-gray-500">
          {activity.subtitle}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => onPrimary(activity)}
          className="rounded-xl bg-[#3046D3] px-5 py-2.5 text-white transition hover:bg-[#253B80]"
        >
          {activity.primary}
        </button>

        {activity.secondary && (
          <button
            type="button"
            disabled={updating}
            onClick={() => onSecondary(activity)}
            className="rounded-xl border px-5 py-2.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating
              ? "Processing..."
              : activity.secondary}
          </button>
        )}
      </div>
    </div>
  );
}
