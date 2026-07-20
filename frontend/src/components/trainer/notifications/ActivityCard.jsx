export default function ActivityCard({
  activity,
  onPrimary,
  onSecondary,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.badgeColor}`}
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

        <p className="text-gray-500 mt-2">
          {activity.subtitle}
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={() => onPrimary(activity)}
          className="px-5 py-2.5 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] transition"
        >
          {activity.primary}
        </button>

        {activity.secondary && (
          <button
            type="button"
            onClick={() => onSecondary(activity)}
            className="px-5 py-2.5 rounded-xl border hover:bg-gray-100 transition"
          >
            {activity.secondary}
          </button>
        )}
      </div>
    </div>
  );
}