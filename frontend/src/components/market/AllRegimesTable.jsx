export default function AllRegimesTable({ regimes }) {
  if (!regimes || regimes.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-white">All Market Regimes</h3>
        <p className="text-gray-400">No regime data available</p>
      </div>
    );
  }

  const regimeIcons = {
    'Bull Quiet': '📈',
    'Bull Volatile': '🚀',
    'Bull Normal': '📊',
    'Bear Quiet': '📉',
    'Bear Volatile': '⚠️',
    'Bear Normal': '📊',
    'Neutral Quiet': '➡️',
    'Neutral Volatile': '⚡',
    'Neutral Normal': '⏸️',
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">All Market Regimes (HSMM)</h3>
      <p className="text-sm text-gray-400 mb-4">
        Hidden Semi-Markov Model detects 9 distinct market states based on volatility and trend
      </p>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Regime</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Probability</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Description</th>
            </tr>
          </thead>
          <tbody>
            {regimes.map((regime, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-gray-800/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{regimeIcons[regime.regime_name] || '📊'}</span>
                    <span className="font-medium text-white">{regime.regime_name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${(regime.probability * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium min-w-[50px]">
                      {(regime.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-400">
                  {regime.description || 'Market regime state'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
