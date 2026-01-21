import { useState, useEffect } from 'react';
import { marketService } from '../services/marketService';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import RegimeIndicator from '../components/market/RegimeIndicator';
import AllRegimesTable from '../components/market/AllRegimesTable';
import RegimeChart from '../components/market/RegimeChart';
import ForecastChart from '../components/charts/ForecastChart';
import RegimeHistoryChart from '../components/charts/RegimeHistoryChart';
import ApiWakeupLoader from '../components/loading/ApiWakeupLoader';
import { SkeletonCard, SkeletonChart } from '../components/loading/SkeletonLoader';
import toast from 'react-hot-toast';
import { RefreshCw, Zap, Trash2 } from 'lucide-react';

export default function MarketOverviewPage() {
  const [marketCondition, setMarketCondition] = useState(null);
  const [allRegimes, setAllRegimes] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyPeriod, setHistoryPeriod] = useState(90);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiWaking, setApiWaking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, []);

  // Auto-refresh every 2 minutes
  useAutoRefresh(() => {
    if (!refreshing && !loading) {
      loadMarketData(true);
    }
  }, 120000, autoRefreshEnabled);

  const loadMarketData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const startTime = Date.now();

      // Load current market condition
      const response = await marketService.getMarketCondition();
      const elapsed = Date.now() - startTime;

      // Extract data from response
      let conditionResult = response.data || response;
      console.log('Market condition:', conditionResult);

      // Handle nested current_regime structure from Python API
      if (conditionResult?.current_regime?.label) {
        conditionResult = {
          ...conditionResult,
          regimeLabel: conditionResult.current_regime.label,
          regimeId: conditionResult.current_regime.id,
        };
      }

      if (!silent && elapsed > 10000) {
        setApiWaking(true);
        setTimeout(() => setApiWaking(false), 2000);
      }

      setMarketCondition(conditionResult);

      // Load all regimes
      try {
        const regimesResponse = await marketService.getAllRegimes();
        const regimesResult = regimesResponse.data || regimesResponse;
        console.log('All regimes:', regimesResult);
        
        // Handle different response structures
        if (Array.isArray(regimesResult)) {
          setAllRegimes(regimesResult);
        } else if (regimesResult?.regimes && Array.isArray(regimesResult.regimes)) {
          setAllRegimes(regimesResult.regimes);
        } else {
          setAllRegimes([]);
        }
      } catch (error) {
        console.log('All regimes not available', error);
      }

      // Load forecast
      try {
        const forecastResponse = await marketService.getRegimeForecast(60, 2000, false);
        const forecastResult = forecastResponse.data || forecastResponse;
        console.log('Forecast result:', forecastResult);
        
        // Update market condition with current regime from forecast
        if (forecastResult?.current_regime?.label) {
          setMarketCondition(prev => ({
            ...prev,
            regimeLabel: forecastResult.current_regime.label,
            regimeId: forecastResult.current_regime.id,
            spxPrice: forecastResult.starting_price,
          }));
        }
        
        // Transform forecast data for Recharts - create time series from single forecast values
        if (forecastResult?.forecast && forecastResult?.starting_price) {
          const days = forecastResult.horizon_days || 60;
          const startPrice = forecastResult.starting_price;
          const expectedPrice = forecastResult.forecast.expected_price;
          const bullCase = forecastResult.forecast.bull_case_95pct;
          const bearCase = forecastResult.forecast.bear_case_5pct;
          
          // Generate daily interpolated values
          const chartData = [];
          for (let i = 0; i <= days; i++) {
            const ratio = i / days;
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            chartData.push({
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              mean: Math.round(startPrice + (expectedPrice - startPrice) * ratio),
              upper: Math.round(startPrice + (bullCase - startPrice) * ratio),
              lower: Math.round(startPrice + (bearCase - startPrice) * ratio),
            });
          }
          setForecast(chartData);
        } else {
          setForecast(null);
        }
      } catch (error) {
        console.log('Forecast not available', error);
      }

      // Load history
      try {
        const historyResponse = await marketService.getRegimeHistory(historyPeriod);
        const historyResult = historyResponse.data || historyResponse;
        console.log('Regime history:', historyResult);
        console.log('First history item:', historyResult.history?.[0]);
        setHistory(historyResult.history || []);
      } catch (error) {
        console.log('History not available', error);
      }
      
      if (silent) {
        toast.success('Market data refreshed', { duration: 2000 });
      }
    } catch (error) {
      if (!silent) {
        toast.error('Failed to load market data');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMarketData();
    setRefreshing(false);
  };

  const handleClearCache = async () => {
    try {
      await marketService.clearCache();
      toast.success('Cache cleared! Refreshing data...');
      await loadMarketData();
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  const handlePeriodChange = async (period) => {
    setHistoryPeriod(period);
    try {
      const historyResponse = await marketService.getRegimeHistory(period);
      const historyResult = historyResponse.data || historyResponse;
      setHistory(historyResult.history || []);
    } catch (error) {
      console.log('Failed to load history:', error);
      toast.error('Failed to update chart period');
    }
  };

  if (apiWaking) {
    return <ApiWakeupLoader message="Loading market data..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Market Overview</h1>
          <p className="text-gray-400 mt-2">
            Real-time market regime detection using Hidden Semi-Markov Models
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefreshEnabled 
                ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                : 'bg-white/5 border border-white/10 text-gray-400'
            }`}
          >
            <Zap className={`w-4 h-4 ${autoRefreshEnabled ? 'text-green-400' : 'text-gray-500'}`} />
            Auto-refresh {autoRefreshEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
            title="Clear cached data and fetch fresh from API"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </button>
          {/* <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button> */}
        </div>
      </div>

      {/* Current Market Regime */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <RegimeIndicator regimeData={marketCondition} />
      )}

      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-2">Total Regimes</p>
          <p className="text-3xl font-bold text-white">{allRegimes.length}</p>
          <p className="text-xs text-gray-500 mt-2">HSMM States</p>
        </div>

        <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-2">Forecast Period</p>
          <p className="text-3xl font-bold text-white">60 Days</p>
          <p className="text-xs text-gray-500 mt-2">Monte Carlo Simulation</p>
        </div>

        <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-2">Simulations</p>
          <p className="text-3xl font-bold text-white">2,000</p>
          <p className="text-xs text-gray-500 mt-2">Price Paths</p>
        </div>
      </div>

      {/* Forecast Chart */}
      {loading ? (
        <SkeletonChart />
      ) : forecast ? (
        <ForecastChart data={forecast} title="Monte Carlo Price Forecast" />
      ) : null}



      {/* Info Section */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold mb-3 text-white">About Market Regimes</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <strong className="text-cyan-400">Hidden Semi-Markov Model (HSMM):</strong> Advanced statistical model that identifies distinct market states based on price action, volatility, and trend patterns.
          </p>
          <p>
            <strong className="text-cyan-400">9 Market Regimes:</strong> Bull (Quiet, Normal, Volatile), Bear (Quiet, Normal, Volatile), and Neutral (Quiet, Normal, Volatile) states.
          </p>
          <p>
            <strong className="text-cyan-400">Monte Carlo Forecasting:</strong> Probabilistic price prediction using {forecast?.simulations || 2000} simulations with regime-aware dynamics.
          </p>
        </div>
      </div>
    </div>
  );
}
