export default function FilterBar({
  types = [],
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Type</span>

        <select
          value={typeFilter}
          onChange={(event) =>
            onTypeChange(event.target.value)
          }
          className="bg-transparent font-medium outline-none"
        >
          <option value="all">All Types</option>

          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="h-8 w-px bg-gray-200" />

      <div className="flex items-center gap-2">
        <span className="text-gray-500">Status</span>

        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="bg-transparent font-medium outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">New Request</option>
          <option value="in_progress">Accepted</option>
          <option value="submitted">In Development</option>
          <option value="revision">Revision</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto rounded-xl border px-5 py-2 transition hover:bg-gray-100"
      >
        Reset Filters
      </button>
    </div>
  );
}
