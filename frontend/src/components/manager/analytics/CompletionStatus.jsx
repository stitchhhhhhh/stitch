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

export default function CompletionStatus({
  totalEnrollments = 0,
  completedEnrollments = 0,
}) {
  const total = Number(totalEnrollments) || 0;
  const completed = Number(completedEnrollments) || 0;
  const inProgress = Math.max(total - completed, 0);

  const data = {
    labels: [
      "Completed",
      "In Progress",
    ],

    datasets: [
      {
        data: [
          completed,
          inProgress,
        ],

        backgroundColor: [
          "#4453F2",
          "#7B87FF",
        ],

        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Completion Status
      </h2>

      {total === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-500">
          No enrollment data available.
        </div>
      ) : (
        <div className="h-72">
          <Doughnut
            data={data}
            options={options}
          />
        </div>
      )}
    </div>
  );
}
