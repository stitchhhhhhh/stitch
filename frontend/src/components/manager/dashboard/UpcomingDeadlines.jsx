const colors = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
};

export default function UpcomingDeadlines({ deadlines }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-7">

      <h2 className="text-2xl font-semibold">
        Upcoming Deadlines
      </h2>

      <p className="text-gray-500 mt-2">
        Training programs nearing completion deadline
      </p>

      <div className="mt-8 space-y-6">

        {deadlines.map((item, index) => (

          <div
            key={index}
            className="border rounded-2xl p-5"
          >

            <div className="flex justify-between">

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <span className="text-sm text-red-500">
                {item.days}
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-3">
              {item.progress}
            </p>

            <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">

              <div
                className={`h-full rounded-full ${colors[item.color]}`}
                style={{
                  width: item.progress.split("%")[0] + "%",
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}