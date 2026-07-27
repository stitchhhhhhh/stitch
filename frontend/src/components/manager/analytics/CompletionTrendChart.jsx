import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) =>
          `Completion Rate: ${context.parsed.y}%`,
      },
    },
  },
};

export default function CompletionTrendChart({
  trend = [],
}) {
  const safeTrend = Array.isArray(trend)
    ? trend
    : [];

  const hasData = safeTrend.some(
    (item) =>
      Number(item.totalEnrollments) > 0
  );

  const data = {
    labels: safeTrend.map(
      (item) => item.label
    ),
    datasets: [
      {
        label: "Completion Rate",
        data: safeTrend.map(
          (item) =>
            Number(item.completionRate) || 0
        ),
        borderColor: "#4453F2",
        backgroundColor:
          "rgba(68, 83, 242, 0.15)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-bold text-[#253B80]">
          Monthly Completion Trend
        </h2>

        <span className="text-sm text-gray-500">
          Last 6 Months
        </span>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          No completion trend data available.
        </div>
      ) : (
        <div className="h-72">
          <Line
            data={data}
            options={options}
          />
        </div>
      )}
    </section>
  );
}
