const awards = [
  {
    title: "Fast Learner",
    icon: "⚡",
    color: "bg-yellow-100",
  },
  {
    title: "Perfect Streak",
    icon: "🔥",
    color: "bg-red-100",
  },
  {
    title: "Top Performer",
    icon: "🏆",
    color: "bg-blue-100",
  },
];

export default function LatestAwards() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold text-[#253B80]">
            Latest Awards
          </h2>

          <p className="text-gray-500 mt-2">
            Recently unlocked achievements
          </p>

        </div>

      </div>

      <div className="space-y-5 mt-8">

        {awards.map((award) => (

          <div
            key={award.title}
            className="flex items-center gap-5"
          >

            <div
              className={`${award.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl`}
            >
              {award.icon}
            </div>

            <div>

              <h3 className="font-bold">
                {award.title}
              </h3>

              <p className="text-gray-500 text-sm">
                Achievement unlocked
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}