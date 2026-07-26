export default function FilterBar({
  filter,
  onFilterChange,
  onMarkAllRead,
  markingAll = false,
  hasUnread = false,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-[#253B80]">
        Activity Feed
      </h2>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={markingAll || !hasUnread}
          className="font-semibold text-[#3046D3] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {markingAll
            ? "Processing..."
            : "Mark all as read"}
        </button>

        <select
          value={filter}
          onChange={(event) =>
            onFilterChange(event.target.value)
          }
          className="rounded-xl border bg-white px-4 py-2"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>
    </div>
  );
}
