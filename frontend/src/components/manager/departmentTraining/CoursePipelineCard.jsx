function formatStatus(status) {
  const value = String(status || "unknown");

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CoursePipelineCard({
  course,
  onAction,
  disabled = false,
}) {
  const progress = Math.min(
    100,
    Math.max(0, Number(course.progress) || 0)
  );

  return (
    <article
      className={`rounded-3xl border-l-4 bg-white p-6 shadow-sm ${course.border || "border-indigo-200"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {formatStatus(course.status)}
        </span>

        {course.deadline && (
          <span className="text-sm text-gray-500">
            Deadline: {formatDate(course.deadline)}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-2xl font-bold">
        {course.title || "Untitled Course"}
      </h2>

      <p className="mt-2 text-gray-500">
        Trainer:{" "}
        {course.trainer || "Not assigned"}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Enrollments:{" "}
        {Number(course.enrollmentCount) || 0}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {course.action1 && (
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onAction(course, course.action1)
            }
            className="rounded-xl bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {disabled
              ? "Updating..."
              : course.action1}
          </button>
        )}

        {course.action2 && (
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onAction(course, course.action2)
            }
            className="rounded-xl border px-5 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {course.action2}
          </button>
        )}

        {course.action3 && (
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onAction(course, course.action3)
            }
            className="ml-auto font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {course.action3}
          </button>
        )}
      </div>
    </article>
  );
}
