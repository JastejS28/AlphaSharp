import { TrendingUp, Shield, Clock, Activity } from 'lucide-react';

export default function MarketStatsCards({ marketCondition }) {
  console.log('MarketStatsCards received:', marketCondition);
  console.log('MarketStatsCards keys:', marketCondition ? Object.keys(marketCondition) : 'null');
  
  if (!marketCondition) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-white/10 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Try all possible field names for VIX (Python API: vix)
  const vixLevel = marketCondition.vix || 
                   marketCondition.vix_level || 
                   marketCondition.vixLevel;
  
  // Try all possible field names for regime label (Python API: current_regime.label)
  const regimeLabel = marketCondition.current_regime?.label || 
                      marketCondition.regime_label || 
                      marketCondition.regimeLabel || 
                      marketCondition.regime?.label ||
                      marketCondition.label ||
                      'Unknown';
  
  // Try all possible field names for regime ID (Python API: current_regime.id)
  const regimeId = marketCondition.current_regime?.id ?? 
                   marketCondition.regime_id ?? 
                   marketCondition.regimeId ?? 
                   marketCondition.regime?.id ??
                   marketCondition.id ?? 0;
  
  const confidence = marketCondition.confidence || 0;

  console.log('Extracted values:', { vixLevel, regimeLabel, regimeId, confidence });

  // Determine regime color
  const getRegimeColor = () => {
    const label = regimeLabel.toLowerCase();
    if (label.includes('bull') || label.includes('recovery')) return 'text-green-500';
    if (label.includes('bear') || label.includes('correction')) return 'text-red-500';
    return 'text-yellow-500';
  };

  // Calculate Risk Level based on regime and VIX
  const getRiskLevel = () => {
    if (regimeId === 1) return { label: 'Extreme', color: 'text-red-600' }; // Severe Bear
    if (regimeId === 2 || regimeId === 6) return { label: 'High', color: 'text-red-500' }; // Bear, Correction
    if (regimeId === 3) return { label: 'Moderate', color: 'text-yellow-500' }; // Neutral
    if (regimeId === 4 || regimeId === 7) return { label: 'Low', color: 'text-green-500' }; // Bull, Recovery
    if (regimeId === 5 || regimeId === 8) return { label: 'Very Low', color: 'text-green-600' }; // Strong Bull, Bull Market
    return { label: 'Unknown', color: 'text-gray-500' };
  };

  // Average Duration (in days) for each regime
  const getAvgDuration = () => {
    const durations = {
      1: 45,   // Severe Bear
      2: 120,  // Bear
      3: 90,   // Neutral
      4: 180,  // Bull
      5: 210,  // Strong Bull
      6: 60,   // Correction
      7: 75,   // Recovery
      8: 240,  // Bull Market
      0: 30    // Unknown
    };
    return durations[regimeId] || 30;
  };

  // Expected Volatility based on VIX level
  const getExpectedVolatility = () => {
    if (!vixLevel) return { label: 'Unknown', color: 'text-gray-500' };
    if (vixLevel < 12) return { label: 'Very Low', color: 'text-green-600' };
    if (vixLevel < 15) return { label: 'Low', color: 'text-green-500' };
    if (vixLevel < 20) return { label: 'Moderate', color: 'text-yellow-500' };
    if (vixLevel < 30) return { label: 'High', color: 'text-orange-500' };
    return { label: 'Extreme', color: 'text-red-500' };
  };

  const riskLevel = getRiskLevel();
  const avgDuration = getAvgDuration();
  const expectedVol = getExpectedVolatility();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Regime */}
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Regime"
        value={regimeLabel}
        iconColor={getRegimeColor()}
      />

      {/* Risk Level */}
      <StatCard
        icon={<Shield className="w-5 h-5" />}
        label="Risk Level"
        value={riskLevel.label}
        subtitleColor={riskLevel.color}
        iconColor="text-cyan-400"
      />

      {/* Average Duration */}
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        label="Avg Duration"
        value={`${avgDuration} days`}
        iconColor="text-cyan-400"
      />

      {/* Expected Volatility */}
      <StatCard
        icon={<Activity className="w-5 h-5" />}
        label="Expected Volatility"
        value={expectedVol.label}
        subtitle={vixLevel ? `VIX: ${vixLevel.toFixed(1)}` : ''}
        subtitleColor={expectedVol.color}
        iconColor="text-cyan-400"
      />
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, subtitleColor, iconColor, iconBg }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <div className={`${iconColor} p-2 rounded-lg`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {value}
      </div>
      {subtitle && (
        <div className={`text-sm font-medium ${subtitleColor}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
