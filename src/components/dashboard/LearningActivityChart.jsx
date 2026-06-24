import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function LearningActivityChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Hours learned',
        data: data.map((d) => d.value),
        backgroundColor: '#3046d6',
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f1f5' } },
      x: { grid: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
}
