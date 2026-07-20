export default function RequestDetail({ course, onApprove, onReject }) {
  if (!course) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6 text-center text-gray-400">
        Pilih kursus untuk melihat detail.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6">

      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-[#253B80]">
          Course Preview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review submitted course before approval.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {course.course_title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Dibuat oleh {course.trainer?.full_name ?? '-'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Program</p>
            <p className="font-medium mt-1">{course.program?.program_name ?? '-'}</p>
          </div>

          <div>
            <p className="text-gray-400">Deadline</p>
            <p className="font-medium mt-1">
              {course.deadline ? new Date(course.deadline).toLocaleDateString('en-GB') : '-'}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-medium mt-1 capitalize">{course.approval_status}</p>
          </div>

          <div>
            <p className="text-gray-400">Dibuat</p>
            <p className="font-medium mt-1">
              {new Date(course.created_date).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-gray-900">Description</h4>
        <p className="text-sm text-gray-500 mt-2 leading-6">
          {course.description || 'Tidak ada deskripsi.'}
        </p>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-gray-900">Materials</h4>
        {course.materials?.length > 0 ? (
          <div className="space-y-3 mt-3">
            {course.materials.map((m) => (
              <div key={m.id} className="border rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-sm">📄 {m.material_title}</span>
                
                  {m.file_url && (
  <a
    href={m.file_url}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 text-sm"
  >
    View
  </a>
)}
                   
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Belum ada materi diunggah.</p>
        )}
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-gray-900">Assessment</h4>
        {course.assessments?.length > 0 ? (
          <div className="bg-gray-50 rounded-xl mt-3 p-4 space-y-2 text-sm">
            {course.assessments.map((a) => (
              <div key={a.id} className="flex justify-between">
                <span className="text-gray-500">{a.title}</span>
                <span className="font-semibold">Passing: {a.passing_score}%</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Belum ada assessment.</p>
        )}
      </div>

      {course.approval_status === "submitted" && (
        <div className="mt-8 flex flex-col gap-3">
          <button
          type="button"
            onClick={() => onApprove(course.id)}
            className="bg-[#2F3FE4] hover:bg-[#2234d6] text-white py-3 rounded-xl font-semibold transition"
          >
            Confirm Approval
          </button>

          <button
          type="button"
            onClick={() => onReject(course.id)}
            className="border border-red-400 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
          >
            Reject Course
          </button>
        </div>
      )}
    </div>
  );
}
