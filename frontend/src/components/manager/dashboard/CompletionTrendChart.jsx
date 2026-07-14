export default function CompletionTrendChart() {
  const data = [55, 72, 64, 90, 86, 98, 78, 94, 110, 124, 132, 145];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-semibold">
            Monthly Completion Trend
          </h2>

          <p className="text-gray-500 mt-2">
            Track department learning completion over time
          </p>

        </div>

        <select className="border rounded-xl px-4 py-2">

          <option>Last 12 Months</option>

        </select>

      </div>

      <div className="mt-10 h-[320px] flex items-end gap-4">

        {data.map((item, index) => (

          <div
            key={index}
            className="flex flex-col items-center flex-1"
          >

            <div
              className="
                w-full
                rounded-t-xl
                bg-gradient-to-t
                from-[#2F3FE4]
                to-[#7C8DFF]
              "
              style={{
                height: `${item * 2}px`
              }}
            />

            <span className="text-xs text-gray-400 mt-3">
              {months[index]}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}