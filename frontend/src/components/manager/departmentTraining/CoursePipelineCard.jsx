export default function CoursePipelineCard({ course }) {
  return (
    <div className={`bg-white rounded-3xl border-l-4 ${course.border} shadow-sm p-6`}>

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

      {course.progress !== null && (
        <div className="mt-6">

          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">

            <div
              className="h-2 rounded-full bg-indigo-600"
              style={{ width: `${course.progress}%` }}
            />

          </div>

        </div>
      )}

      <div className="flex gap-3 mt-8 flex-wrap">

        {course.action1 && (
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl">
            {course.action1}
          </button>
        )}

        {course.action2 && (
          <button className="px-5 py-2 border rounded-xl">
            {course.action2}
          </button>
        )}

        {course.action3 && (
          <button className="ml-auto text-red-600 font-semibold">
            {course.action3}
          </button>
        )}

      </div>

    </div>
  );
}