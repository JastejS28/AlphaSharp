import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ForecastChart({ forecastData }) {
  if (!forecastData) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Price Forecast</h3>
        <p className="text-gray-500">No forecast data available</p>
      </div>
    );
  }

  const { mean_forecast, lower_bound, upper_bound, dates, paths } = forecastData;

  const data = {
    labels: dates || Array.from({ length: mean_forecast?.length || 0 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Mean Forecast',
        data: mean_forecast,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Upper Bound (95%)',
        data: upper_bound,
        borderColor: 'rgba(34, 197, 94, 0.5)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderWidth: 1,
        borderDash: [5, 5],
        tension: 0.4,
        fill: '+1',
      },
      {
        label: 'Lower Bound (95%)',
        data: lower_bound,
        borderColor: 'rgba(239, 68, 68, 0.5)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 1,
        borderDash: [5, 5],
        tension: 0.4,
        fill: '-1',
      },
    ],
  };

  // Add sample paths if available (max 5 for clarity)
  if (paths && paths.length > 0) {
    const samplePaths = paths.slice(0, 5);
    samplePaths.forEach((path, index) => {
      data.datasets.push({
        label: `Sample Path ${index + 1}`,
        data: path,
        borderColor: `rgba(156, 163, 175, 0.2)`,
        borderWidth: 1,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      });
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Monte Carlo Price Forecast</h3>
      <p className="text-sm text-gray-600 mb-4">
        Regime-aware probabilistic forecast with {forecastData.simulations || 2000} simulations
      </p>
      <div style={{ height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
