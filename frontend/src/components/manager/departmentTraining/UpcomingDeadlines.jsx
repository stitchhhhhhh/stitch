function formatDeadline(value) {
  if (!value) {
    return {
      month: "--",
      day: "--",
      fullDate: "No deadline",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "--",
      day: "--",
      fullDate: "Invalid deadline",
    };
  }

  return {
    month: date
      .toLocaleString("en-US", {
        month: "short",
      })
      .toUpperCase(),
    day: String(date.getDate()).padStart(2, "0"),
    fullDate: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

export default function UpcomingDeadlines({
  deadlines = [],
}) {
  const safeDeadlines = Array.isArray(deadlines)
    ? deadlines
    : [];

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">
        Upcoming Deadlines
      </h2>

      {safeDeadlines.length === 0 ? (
        <p className="text-sm text-gray-500">
          No upcoming deadlines.
        </p>
      ) : (
        <div className="space-y-6">
          {safeDeadlines.map((item) => {
            const date = formatDeadline(
              item.deadline
            );

            return (
              <div
                key={
                  item.courseId ||
                  `${item.title}-${item.deadline}`
                }
                className="flex gap-4"
              >
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-indigo-100">
                  <div className="text-xs">
                    {date.month}
                  </div>

                  <div className="font-bold">
                    {date.day}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">
                    {item.title ||
                      "Untitled course"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {date.fullDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
