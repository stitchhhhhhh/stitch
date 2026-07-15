export default function ProgressSection() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between">

        <div>

          <h2 className="font-bold text-xl">
            Your Progress
          </h2>

          <p className="text-gray-500 mt-2">
            You're in the top 5% of learners this month.
          </p>

        </div>

        <div className="text-right">

          <h1 className="text-4xl font-bold text-[#3046D3]">
            Rank #14
          </h1>

          <p className="text-gray-500">
            Global Ranking
          </p>

        </div>

      </div>

      <div className="mt-8">

        <div className="flex justify-between mb-2">

          <span className="font-semibold">
            Level 8 Specialist
          </span>

          <span className="text-sm text-gray-500">
            550 pts to Rank #13
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-gray-200">

          <div
            className="h-3 rounded-full bg-[#3046D3]"
            style={{ width: "72%" }}
          />

        </div>

      </div>

      <div className="grid grid-cols-3 gap-5 mt-10">

        <div className="bg-[#F7F8FF] rounded-2xl p-5">

          <p className="text-xs text-gray-500">
            RECENT BADGE
          </p>

          <h3 className="font-bold mt-2">
            Fast Learner III
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Earned 2 days ago
          </p>

        </div>

        <div className="bg-[#F7F8FF] rounded-2xl p-5 text-center">

          <h2 className="text-4xl font-bold text-[#3046D3]">
            12
          </h2>

          <p className="text-sm text-gray-500">
            Rank Jump
          </p>

        </div>

        <div className="bg-[#F7F8FF] rounded-2xl p-5 text-center">

          <h2 className="text-4xl font-bold text-[#3046D3]">
            +850
          </h2>

          <p className="text-sm text-gray-500">
            This Week
          </p>

        </div>

      </div>

    </div>
  );
}