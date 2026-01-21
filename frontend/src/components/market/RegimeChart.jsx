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

export default function RegimeChart({ historicalData }) {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-white">Regime History</h3>
        <p className="text-gray-400">No historical data available</p>
      </div>
    );
  }

  const regimeColors = {
    'Bull Quiet': 'rgba(34, 197, 94, 0.2)',
    'Bull Volatile': 'rgba(22, 163, 74, 0.3)',
    'Bull Normal': 'rgba(74, 222, 128, 0.2)',
    'Bear Quiet': 'rgba(239, 68, 68, 0.2)',
    'Bear Volatile': 'rgba(220, 38, 38, 0.3)',
    'Bear Normal': 'rgba(248, 113, 113, 0.2)',
    'Neutral Quiet': 'rgba(156, 163, 175, 0.2)',
    'Neutral Volatile': 'rgba(234, 179, 8, 0.3)',
    'Neutral Normal': 'rgba(209, 213, 219, 0.2)',
  };

  // Process data for chart
  const dates = historicalData.map(d => new Date(d.date).toLocaleDateString());
  const regimes = historicalData.map(d => d.regime);
  
  // Create regime numeric mapping
  const regimeMap = {
    'Bull Volatile': 3,
    'Bull Normal': 2,
    'Bull Quiet': 1,
    'Neutral Volatile': 0,
    'Neutral Normal': 0,
    'Neutral Quiet': 0,
    'Bear Quiet': -1,
    'Bear Normal': -2,
    'Bear Volatile': -3,
  };

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Market Regime',
        data: regimes.map(r => regimeMap[r] || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
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
      tooltip: {
        callbacks: {
          label: function(context) {
            const regime = regimes[context.dataIndex];
            return regime;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            const labels = {
              '3': 'Bull Volatile',
              '2': 'Bull Normal',
              '1': 'Bull Quiet',
              '0': 'Neutral',
              '-1': 'Bear Quiet',
              '-2': 'Bear Normal',
              '-3': 'Bear Volatile',
            };
            return labels[value] || '';
          }
        }
      }
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">Regime History</h3>
      <div style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
