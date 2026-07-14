export default function ProgramCard({ program }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition">

      <div className={`${program.color} h-40 p-6 text-white`}>

        <div className="flex justify-between">

          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
            {program.category}
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
            {program.status}
          </span>

        </div>

        <h2 className="mt-8 text-2xl font-bold">
          {program.title}
        </h2>

      </div>

      <div className="p-6">

        <p className="text-sm text-gray-500">
          {program.deadline}
        </p>

        <div className="mt-5">

          <div className="flex justify-between mb-2">

            <span className="text-sm text-gray-500">
              Completion
            </span>

            <span className="font-semibold">
              {program.progress}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-[#3948F2] h-3 rounded-full"
              style={{
                width: `${program.progress}%`,
              }}
            />

          </div>

        </div>

        <p className="mt-4 text-sm text-gray-600">
          {program.completed}
        </p>

        <button
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