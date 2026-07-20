const STATUS_MAP = {
  draft: { progress: 33, label: "In Development", color: "bg-blue-600" },
  submitted: { progress: 66, label: "Reviewing", color: "bg-gray-600" },
  approved: { progress: 100, label: "Published", color: "bg-green-600" },
  rejected: { progress: 100, label: "Revision Needed", color: "bg-red-400" },
};

export default function DevelopmentPipeline({ courses = [] }) {
  const active = courses.filter((c) => c.approval_status !== "approved").slice(0, 3);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#253B80]">
          Development Pipeline
        </h2>

        <span className="bg-blue-100 text-[#3046D3] px-3 py-1 rounded-full text-sm font-semibold">
          {active.length} Active
        </span>
      </div>

      {active.length === 0 ? (
        <p className="text-gray-400 text-sm">Tidak ada kursus dalam pengembangan.</p>
      ) : (
        <div className="space-y-7">
          {active.map((course) => {
            const meta = STATUS_MAP[course.approval_status] ?? STATUS_MAP.draft;
            return (
              <div key={course.id}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold">{course.course_title}</h3>
                    <p className="text-sm text-gray-500">
                      {course.program?.program_name ?? ''}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-[#3046D3]">
                    {meta.label}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${meta.color} h-2 rounded-full`}
                    style={{ width: `${meta.progress}%` }}
                  />
                </div>

                <p className="text-right text-xs text-gray-500 mt-2">
                  {meta.progress}%
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
