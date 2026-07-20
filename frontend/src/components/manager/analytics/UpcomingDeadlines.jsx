function formatDeadline(deadline) {
  if (!deadline) return "";

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Invalid deadline";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UpcomingDeadlines({
  courses = [],
}) {
  const now = new Date();

  const upcomingCourses = Array.isArray(courses)
    ? courses
        .filter((course) => {
          if (!course.deadline) return false;

          const deadline = new Date(course.deadline);

          return (
            !Number.isNaN(deadline.getTime()) &&
            deadline >= now &&
            course.approval_status === "approved"
          );
        })
        .sort(
          (a, b) =>
            new Date(a.deadline) -
            new Date(b.deadline)
        )
        .slice(0, 5)
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#253B80] mb-5">
        Upcoming Deadlines
      </h2>

      {upcomingCourses.length === 0 ? (
        <p className="text-sm text-gray-500">
          No upcoming deadlines.
        </p>
      ) : (
        <div className="space-y-5">
          {upcomingCourses.map((item) => (
            <div key={item.id}>
              <p className="font-semibold">
                {item.course_title}
              </p>

              <p className="text-sm text-gray-500">
                {item.program?.program_name || "No program"}
              </p>

              <p className="text-sm text-red-500">
                Due {formatDeadline(item.deadline)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
