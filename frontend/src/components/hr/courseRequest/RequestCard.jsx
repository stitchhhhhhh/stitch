const STATUS_STYLE = {
  submitted: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
};

export default function RequestCard({ course, onApprove, onReject, onSelect }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {course.course_title}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Created by{" "}
            <span className="font-medium text-gray-700">
              {course.trainer?.full_name ?? '-'}
            </span>
            {" • "}
            {new Date(course.created_date).toLocaleDateString('en-GB')}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[course.approval_status] ?? STATUS_STYLE.draft}`}>
          {course.approval_status}
        </span>
      </div>

      <p className="text-gray-600 mt-5 leading-relaxed">
        {course.description || 'No description available.'}
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <p className="text-xs text-gray-400 uppercase">Program</p>
          <p className="font-semibold text-gray-800 mt-1">
            {course.program?.program_name ?? '-'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">Materials</p>
          <p className="font-semibold text-gray-800 mt-1">
            {course.materials?.length ?? 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">Assessments</p>
          <p className="font-semibold text-gray-800 mt-1">
            {course.assessments?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        {course.approval_status === "submitted" ? (
          <>
            <button
            type="button"
              onClick={() => onApprove(course.id)}
              className="flex-1 bg-[#2F3FE4] hover:bg-[#2435d8] text-white rounded-xl py-3 font-medium transition"
            >
              Approve
            </button>

            <button
            type="button"
              onClick={() => onReject(course.id)}
              className="flex-1 border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
            >
              Reject
            </button>
          </>
        ) : (
          <div className="flex-1 text-center text-sm text-gray-400 py-3">
            Already reviewed
          </div>
        )}

        <button
        type="button"
          onClick={() => onSelect(course)}
          className="flex-1 text-center border border-[#2F3FE4] text-[#2F3FE4] rounded-xl py-3 font-medium hover:bg-blue-50 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
