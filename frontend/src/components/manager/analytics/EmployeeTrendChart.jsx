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

const data = {
  labels: [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Today",
  ],

  datasets: [
    {
      label: "Employees",

      data: [22, 19, 25, 17, 24, 28],

      backgroundColor: "#4453F2",

      borderRadius: 10,
    },
  ],
};

const options = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },
};

export default function EmployeeTrendChart() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-xl font-bold text-[#253B80] mb-6">

        Employee Participation Trend

      </h2>

      <div className="h-72">

        <Bar
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}