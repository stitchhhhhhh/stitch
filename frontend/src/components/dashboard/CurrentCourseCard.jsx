export default function CurrentCourseCard({ course, onContinue }) {
  if (!course) return null;

  const progress = course.enrollment?.completion_percentage ?? 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-[260px_1fr]">
      {/* Thumbnail placeholder */}
      <div className="bg-gradient-to-br from-brand-800 to-gray-900 min-h-[200px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20" />
      </div>

      <div className="p-6 flex flex-col">
        <span className="inline-block self-start text-[11px] font-bold uppercase tracking-wide text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full mb-3">
          In Progress
        </span>

        <h3 className="text-xl font-bold text-gray-900">{course.course_title}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">
          {course.description}
        </p>

        <div className="mt-5">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-500 font-medium">Overall Progress</span>
            <span className="text-gray-900 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-brand-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-5 self-start bg-brand-600 text-white text-sm font-semibold rounded-xl px-6 py-3 hover:bg-brand-700 transition-colors"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}