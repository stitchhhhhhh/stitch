export default function MonthlyTrendChart() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-semibold text-[#253B80]">
            Monthly Completion Trend
          </h2>

          <p className="text-gray-500 mt-1">
            Tracking course completions across all divisions
          </p>

        </div>

        <select className="border border-gray-200 rounded-xl px-4 py-2 outline-none">
          <option>Last 12 Months</option>
        </select>

      </div>

      {/* Chart */}
      <div className="relative mt-10 h-[320px]">

        {/* Background Grid */}
        <div className="absolute inset-0 flex flex-col justify-between">

          {[1,2,3,4,5].map((i)=>(
            <div
              key={i}
              className="border-t border-dashed border-gray-200"
            />
          ))}

        </div>

        <svg
          viewBox="0 0 700 300"
          className="absolute inset-0 w-full h-full"
        >

          <defs>

            <linearGradient
              id="completionGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#2F3FE4"
                stopOpacity=".28"
              />

              <stop
                offset="100%"
                stopColor="#2F3FE4"
                stopOpacity="0"
              />

            </linearGradient>

          </defs>

          {/* Area */}

          <path
            d="
              M30 250
              C90 240 120 185 170 150
              C220 120 280 90 340 120
              C400 150 450 190 510 150
              C560 120 610 70 670 40
              L670 280
              L30 280
              Z
            "
            fill="url(#completionGradient)"
          />

          {/* Line */}

          <path
            d="
              M30 250
              C90 240 120 185 170 150
              C220 120 280 90 340 120
              C400 150 450 190 510 150
              C560 120 610 70 670 40
            "
            fill="none"
            stroke="#2F3FE4"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Points */}

          {[
            [30,250],
            [170,150],
            [340,120],
            [510,150],
            [670,40]
          ].map(([x,y],i)=>(
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="7"
                fill="#2F3FE4"
              />
              <circle
                cx={x}
                cy={y}
                r="12"
                fill="#2F3FE4"
                opacity=".15"
              />
            </g>
          ))}

        </svg>

        {/* Month Labels */}

        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-sm text-gray-500">

          {[
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
          ].map((month) => (
            <span key={month}>{month}</span>
          ))}

        </div>

      </div>

    </div>
  );
}