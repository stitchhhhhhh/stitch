const filters = [
  "All",
  "Course Assignments",
  "Deadlines",
  "Certificates",
  "Assessments",
];

export default function NotificationFilter({
  activeFilter,
  onFilterChange,
  onMarkAllRead,
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => {
          const active = activeFilter === filter;

          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-6 py-3 rounded-full border transition ${
                active
                  ? "bg-[#3046D3] text-white border-[#3046D3]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <button
        onClick={onMarkAllRead}
        className="text-[#3046D3] font-semibold"
      >
        ✓ Mark all as read
      </button>
    </div>
  );
}