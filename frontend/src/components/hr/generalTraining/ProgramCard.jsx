const STATUS_COLOR = {
  active: "bg-[#3948F2]",
  draft: "bg-gray-500",
  archived: "bg-gray-400",
};

export default function ProgramCard({ program, onViewDetails }) {
  const color = STATUS_COLOR[program.status] ?? "bg-[#3948F2]";
  const courseCount = program.courses?.length ?? 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition">

      <div className={`${color} h-40 p-6 text-white`}>

        <div className="flex justify-between">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
            {program.program_type}
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
            {program.status}
          </span>
        </div>

        <h2 className="mt-8 text-2xl font-bold line-clamp-2">
          {program.program_name}
        </h2>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-500 line-clamp-2">
          {program.description || "Tidak ada deskripsi."}
        </p>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-gray-500">Department</span>
          <span className="font-semibold">
            {program.department?.name ?? "General"}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Courses</span>
          <span className="font-semibold">{courseCount}</span>
        </div>

        <button
          onClick={() => onViewDetails?.(program)}
          className="
          w-full
          mt-6
          rounded-xl
          bg-[#3948F2]
          text-white
          py-3
          hover:bg-[#2836d9]
          transition
          "
        >
          View Details
        </button>
      </div>
    </div>
  );
}
