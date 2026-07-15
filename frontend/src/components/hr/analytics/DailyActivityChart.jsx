const data = [40, 55, 35, 62, 80, 50, 68];

export default function DailyActivityChart() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-8">

        <h2 className="font-semibold">
          Daily Activity Trend
        </h2>

        <span className="text-xs text-gray-400">
          Active sessions/day
        </span>

      </div>

      <div className="flex items-end justify-between h-40">

        {data.map((value, index) => (

          <div
            key={index}
            className={`w-8 rounded-t-xl ${
              index === 4
                ? "bg-[#2F3FE4]"
                : "bg-[#C7CDF8]"
            }`}
            style={{
              height: `${value}%`,
            }}
          />

        ))}

      </div>

    </div>
  );
}