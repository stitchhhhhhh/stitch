export default function AssessmentCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

      <h2 className="text-2xl font-bold text-[#253B80] mb-6">
        Final Assessment
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span className="text-gray-500">Questions</span>
          <span className="font-semibold">25</span>
        </div>

        <div className="border-t"></div>

        <div className="flex justify-between">
          <span className="text-gray-500">Passing Score</span>
          <span className="font-semibold">80%</span>
        </div>

        <div className="border-t"></div>

        <div className="flex justify-between">
          <span className="text-gray-500">Time Limit</span>
          <span className="font-semibold">45 min</span>
        </div>

      </div>

      <div className="mt-8">
        <h4 className="text-sm font-semibold text-gray-500 mb-3">
          Question Types
        </h4>

        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            Multiple Choice
          </span>

          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
            Case Study
          </span>

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
            Practical Lab
          </span>
        </div>
      </div>

    </div>
  );
}