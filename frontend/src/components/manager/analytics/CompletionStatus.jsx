import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const data = {
  labels: [
    "Completed",
    "In Progress",
    "Overdue",
  ],

  datasets: [
    {
      data: [42, 6, 2],

      backgroundColor: [
        "#4453F2",
        "#7B87FF",
        "#EF4444",
      ],

      borderWidth: 0,
    },
  ],
};

const options = {
  responsive: true,

  maintainAspectRatio: false,

  cutout: "70%",

  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

export default function CompletionStatus() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-xl font-bold text-[#253B80] mb-6">

        Completion Status

      </h2>

      <div className="h-72">

        <Doughnut
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}