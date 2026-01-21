import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StockMetrics({ data }) {
  if (!data) return null;

  const metrics = [
    { label: 'Market Cap', value: data.market_cap || data.marketCap, format: 'currency' },
    { label: 'P/E Ratio', value: data.pe_ratio || data.trailing_pe, format: 'number' },
    { label: 'EPS', value: data.eps || data.trailing_eps, format: 'currency' },
    { label: '52W High', value: data['52_week_high'] || data.fifty_two_week_high, format: 'currency' },
    { label: '52W Low', value: data['52_week_low'] || data.fifty_two_week_low, format: 'currency' },
    { label: 'Volume', value: data.volume, format: 'number' },
    { label: 'Avg Volume', value: data.average_volume || data.avg_volume, format: 'number' },
    { label: 'Dividend Yield', value: data.dividend_yield, format: 'percent' },
  ];

  const formatValue = (value, format) => {
    if (!value || value === 'N/A') return 'N/A';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value);
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      case 'percent':
        return `${(value * 100).toFixed(2)}%`;
      default:
        return value;
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">Key Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
            <p className="text-lg font-semibold text-white">
              {formatValue(metric.value, metric.format)}
            </p>
          </div>
        ))}
      </div>

      {data.analyst_recommendation && (
        <div className="mt-6 p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Analyst Recommendation</p>
              <p className="text-lg font-semibold text-cyan-400 uppercase">
                {data.analyst_recommendation}
              </p>
            </div>
            {data.analyst_recommendation === 'buy' && (
              <TrendingUp className="w-8 h-8 text-green-500" />
            )}
            {data.analyst_recommendation === 'sell' && (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
