export default function CourseStatistics() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm h-[420px]">

      <h2 className="font-semibold text-xl">
        Course Statistics
      </h2>

      <p className="text-gray-500">
        Overall status breakdown
      </p>

      <div className="flex justify-center mt-10">

        <div className="w-52 h-52 rounded-full border-[18px] border-gray-500 flex items-center justify-center">

          <div className="text-center">

            <h2 className="text-4xl font-bold">
              1.2k
            </h2>

            <p className="text-gray-500">
              TOTAL
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-4 mt-10">

        <div className="flex justify-between">

          <div className="flex items-center gap-2">

            <div className="w-3 h-3 rounded-full bg-[#2F3FE4]"/>

            Completed

          </div>

          <b>75%</b>

        </div>

        <div className="flex justify-between">

          <div className="flex items-center gap-2">

            <div className="w-3 h-3 rounded-full bg-gray-500"/>

            In Progress

          </div>

          <b>15%</b>

        </div>

        <div className="flex justify-between">

          <div className="flex items-center gap-2">

            <div className="w-3 h-3 rounded-full bg-gray-300"/>

            Not Started

          </div>

          <b>10%</b>

        </div>

      </div>

    </div>
  );
}