import { useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const REGIME_COLORS = {
  0: { bg: '#fee2e2', name: 'Unknown', color: '#9ca3af' },
  1: { bg: '#fecaca', name: 'Severe Bear', color: '#dc2626' },
  2: { bg: '#fed7aa', name: 'Bear', color: '#ea580c' },
  3: { bg: '#fef3c7', name: 'Neutral', color: '#ca8a04' },
  4: { bg: '#d9f99d', name: 'Bull', color: '#65a30d' },
  5: { bg: '#86efac', name: 'Strong Bull', color: '#16a34a' },
  6: { bg: '#fca5a5', name: 'Correction', color: '#dc2626' },
  7: { bg: '#bbf7d0', name: 'Recovery', color: '#10b981' },
  8: { bg: '#bfdbfe', name: 'Bull Market', color: '#3b82f6' },
};

const TIME_PERIODS = [
  { value: 30, label: '1M' },
  { value: 60, label: '2M' },
  { value: 90, label: '3M' },
  { value: 180, label: '6M' },
  { value: 365, label: '1Y' },
  { value: 750, label: '3Y' },
];

export default function RegimeHistoryChart({ data, title = 'Regime History', onPeriodChange, initialPeriod = 90 }) {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  console.log('RegimeHistoryChart received data:', data);
  console.log('Data length:', data?.length);
  console.log('Data is array?', Array.isArray(data));

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
        <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No regime history data available
        </div>
      </div>
    );
  }

  // Find regime transitions
  const transitions = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i].regime_id !== data[i - 1].regime_id) {
      transitions.push({
        date: data[i].date,
        from: data[i - 1].regime_label,
        to: data[i].regime_label,
        price: data[i].spx_price,
      });
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const regimeId = payload[0]?.payload?.regime_id || 0;
      const regimeInfo = REGIME_COLORS[regimeId];
      
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">SPX:</span> ${payload[0]?.value?.toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">VIX:</span> {payload[1]?.value?.toFixed(2)}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Regime:</span>{' '}
              <span style={{ color: regimeInfo.color }} className="font-semibold">
                {regimeInfo.name}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Create segments for different regimes (for background coloring)
  const segments = [];
  let currentRegime = data[0]?.regime_id;
  let startIdx = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i].regime_id !== currentRegime) {
      segments.push({
        start: data[startIdx].date,
        end: data[i - 1].date,
        regime: currentRegime,
      });
      currentRegime = data[i].regime_id;
      startIdx = i;
    }
  }
  // Add last segment
  segments.push({
    start: data[startIdx].date,
    end: data[data.length - 1].date,
    regime: currentRegime,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        
        <div className="flex gap-2">
          {TIME_PERIODS.map(period => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Regime Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        {Object.entries(REGIME_COLORS).map(([id, info]) => (
          id !== '0' && (
            <div key={id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: info.color }}
              />
              <span className="text-gray-700 dark:text-gray-300">{info.name}</span>
            </div>
          )
        ))}
      </div>

      {/* Transitions Summary */}
      {transitions.length > 0 && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p>{transitions.length} regime transition{transitions.length !== 1 ? 's' : ''} detected</p>
        </div>
      )}

      <div className="text-xs text-gray-500 mb-2">
        Data points: {data.length} | Transitions: {transitions.length} | Segments: {segments.length}
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => {
              try {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              } catch (e) {
                return value;
              }
            }}
          />
          
          {/* Left Y-axis for SPX */}
          <YAxis
            yAxisId="left"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
            label={{ value: 'S&P 500', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
          />
          
          {/* Right Y-axis for VIX */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            label={{ value: 'VIX', angle: 90, position: 'insideRight', fill: '#6b7280' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* SPX Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spx_price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="S&P 500"
          />

          {/* VIX Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="vix"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="VIX"
          />

          {/* Regime transition markers */}
          {transitions.slice(0, 5).map((transition, idx) => (
            <ReferenceLine
              key={idx}
              x={transition.date}
              yAxisId="left"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `${transition.from} → ${transition.to}`,
                position: 'top',
                fill: '#ef4444',
                fontSize: 10,
              }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
