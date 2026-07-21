function getActivityText(course) {
  const title = course.course_title || "Untitled Course";

  const messages = {
    draft: `${title} is still in draft`,
    submitted: `${title} submitted for review`,
    revision: `${title} requires revision`,
    approved: `${title} has been published`,
    rejected: `${title} was rejected`,
  };

  return messages[course.approval_status] || `${title} was updated`;
}

function formatDate(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentActivities({ courses = [] }) {
  const activities = [...courses]
    .sort(
      (first, second) =>
        new Date(second.created_date || 0) -
        new Date(first.created_date || 0)
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No recent course activity.
        </p>
      ) : (
        <div className="space-y-5">
          {activities.map((course) => (
            <div key={course.id} className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-[#3046D3] mt-2 shrink-0" />

              <div>
                <h3 className="font-semibold">
                  {getActivityText(course)}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(course.created_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}