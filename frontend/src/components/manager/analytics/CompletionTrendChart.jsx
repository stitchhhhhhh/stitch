import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

  datasets: [
    {
      label: "Completion Rate",
      data: [48, 56, 61, 67, 75, 82],
      borderColor: "#4453F2",
      backgroundColor: "rgba(68,83,242,.15)",
      borderWidth: 3,
      fill: true,
      tension: .4,
    },
  ],
};

const options = {
  responsive: true,

  plugins: {
    legend: {
      display: false,
    },
  },

  maintainAspectRatio: false,
};

export default function CompletionTrendChart() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between mb-6">

        <h2 className="text-xl font-bold text-[#253B80]">
          Monthly Completion Trend
        </h2>

        <span className="text-sm text-gray-500">
          Last 6 Months
        </span>

      </div>

      <div className="h-72">

        <Line
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}