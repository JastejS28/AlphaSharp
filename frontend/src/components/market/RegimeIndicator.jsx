export default function RegimeIndicator({ regimeData }) {
  if (!regimeData) return null;

  // Handle fallback/unavailable state
  if (regimeData._fallback || regimeData.marketStatus === 'unavailable') {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-white">Current Market Regime</h3>
        
        <div className="p-6 rounded-lg border-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">⏳</span>
              <div>
                <h2 className="text-2xl font-bold">Market Data Loading</h2>
                <p className="text-sm opacity-75">
                  Waiting for market data to become available...
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-yellow-500/20">
            <p className="text-sm">
              The market analysis API may be initializing. This typically takes 30-60 seconds on first load.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const regimeColors = {
    'Bull Quiet': 'bg-green-100 text-green-800 border-green-300',
    'Bull Volatile': 'bg-green-100 text-green-700 border-green-400',
    'Bull Normal': 'bg-green-50 text-green-700 border-green-300',
    'Bear Quiet': 'bg-red-100 text-red-800 border-red-300',
    'Bear Volatile': 'bg-red-100 text-red-700 border-red-400',
    'Bear Normal': 'bg-red-50 text-red-700 border-red-300',
    'Neutral Quiet': 'bg-gray-100 text-gray-800 border-gray-300',
    'Neutral Volatile': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Neutral Normal': 'bg-gray-50 text-gray-700 border-gray-300',
  };

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

  const currentRegime = regimeData.regimeLabel || regimeData.current_regime || regimeData.regime_name || 'Unknown';
  const probability = regimeData.confidence || regimeData.probability || regimeData.regime_probability;
  const colorClass = regimeColors[currentRegime] || 'bg-gray-100 text-gray-800 border-gray-300';
  const icon = regimeIcons[currentRegime] || '📊';

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-white">Current Market Regime</h3>
      
      <div className={`p-6 rounded-lg border-2 ${colorClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{currentRegime}</h2>
              {probability && (
                <p className="text-sm opacity-75">
                  Probability: {(probability * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>

        {regimeData.description && (
          <p className="text-sm mt-4 leading-relaxed">
            {regimeData.description}
          </p>
        )}

        {regimeData.characteristics && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold">Characteristics:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {Object.entries(regimeData.characteristics).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {regimeData.last_updated && (
          <p className="text-xs mt-4 opacity-60">
            Last updated: {new Date(regimeData.last_updated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
