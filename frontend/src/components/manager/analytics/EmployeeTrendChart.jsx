import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export default function EmployeeTrendChart({
  trend = [],
}) {
  const safeTrend = Array.isArray(trend)
    ? trend
    : [];

  const hasData = safeTrend.some(
    (item) => Number(item.employees) > 0
  );

  const data = {
    labels: safeTrend.map(
      (item) => item.label
    ),
    datasets: [
      {
        label: "Employees",
        data: safeTrend.map(
          (item) =>
            Number(item.employees) || 0
        ),
        backgroundColor: "#4453F2",
        borderRadius: 10,
      },
    ],
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-[#253B80]">
        Employee Participation Trend
      </h2>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          No employee participation data
          available.
        </div>
      ) : (
        <div className="h-72">
          <Bar
            data={data}
            options={options}
          />
        </div>
      )}
    </section>
  );
}
