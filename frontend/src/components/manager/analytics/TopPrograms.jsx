export default function TopPrograms({
  programs = [],
}) {
  const topPrograms = Array.isArray(programs)
    ? [...programs]
        .sort(
          (a, b) =>
            (b.courses?.length || 0) -
            (a.courses?.length || 0)
        )
        .slice(0, 5)
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#253B80] mb-5">
        Top Programs
      </h2>

      {topPrograms.length === 0 ? (
        <p className="text-sm text-gray-500">
          No program data available.
        </p>
      ) : (
        <div className="space-y-4">
          {topPrograms.map((item, index) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-semibold">
                  {index + 1}. {item.program_name}
                </p>

                <p className="text-sm text-gray-500">
                  {item.courses?.length || 0} courses
                </p>
              </div>

              <span className="text-green-500 text-xl">
                ↗
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
