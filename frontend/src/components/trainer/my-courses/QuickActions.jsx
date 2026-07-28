export default function QuickActions({
  onEdit,
  onUpload,
  onView,
  disableEdit = false,
  disableView = false,
}) {
  const actions = [
    {
      title: "Continue Editing",
      icon: "✏️",
      action: onEdit,
      disabled: disableEdit,
    },
    {
      title: "Upload Materials",
      icon: "📁",
      action: onUpload,
      disabled: disableEdit,
    },
    {
      title: "View Course",
      icon: "👁️",
      action: onView,
      disabled: disableView,
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-[#253B80]">
        Quick Actions
      </h2>

      <div className="space-y-4">
        {actions.map((item) => (
          <button
            type="button"
            key={item.title}
            onClick={item.action}
            disabled={
              item.disabled ||
              typeof item.action !== "function"
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-[#F7F8FF] p-4 text-left transition hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              {item.icon}
            </div>

            <span className="font-medium">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}