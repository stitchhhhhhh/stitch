function formatDeadline(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
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

export default function UpcomingDeadlines({
  deadlines = [],
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Upcoming Deadlines
      </h2>

      <div className="space-y-5">
        {deadlines.length === 0 ? (
          <p className="text-sm text-gray-500">
            No upcoming deadlines.
          </p>
        ) : (
          deadlines.map((item) => (
            <div
              key={item.id}
              className="border-b last:border-none pb-4"
            >
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {item.training}
              </p>

              <p className="text-red-500 text-sm mt-2">
                Due{" "}
                {formatDeadline(
                  item.deadline
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}