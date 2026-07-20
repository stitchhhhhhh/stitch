export default function CoursePipelineCard({
  course,
  onAction,
}) {
  return (
    <div
      className={`bg-white rounded-3xl border-l-4 ${course.border} shadow-sm p-6`}
    >
      <div className="flex justify-between items-center">
        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 font-semibold text-gray-700">
          {course.status}
        </span>

        {course.date && (
          <span className="text-sm text-gray-500">
            {course.date}
          </span>
        )}
      </div>

      <h2 className="text-2xl font-bold mt-5">
        {course.title}
      </h2>

      {course.trainer && (
        <p className="text-gray-500 mt-2">
          👤 Trainer: {course.trainer}
        </p>
      )}

      {course.progress !== null &&
        course.progress !== undefined && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{
                  width: `${course.progress}%`,
                }}
              />
            </div>
          </div>
        )}

      <div className="flex gap-3 mt-8 flex-wrap">
        {course.action1 && (
          <button
            type="button"
            onClick={() =>
              onAction(course, course.action1)
            }
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            {course.action1}
          </button>
        )}

        {course.action2 && (
          <button
            type="button"
            onClick={() =>
              onAction(course, course.action2)
            }
            className="px-5 py-2 border rounded-xl hover:bg-gray-100 transition"
          >
            {course.action2}
          </button>
        )}

        {course.action3 && (
          <button
            type="button"
            onClick={() =>
              onAction(course, course.action3)
            }
            className="ml-auto text-red-600 font-semibold hover:text-red-700"
          >
            {course.action3}
          </button>
        )}
      </div>
    </div>
  );
}