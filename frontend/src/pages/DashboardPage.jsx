import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketService } from '../services/marketService';
import { watchlistService } from '../services/watchlistService';
import RegimeHistoryChart from '../components/charts/RegimeHistoryChart';
import PortfolioSummaryWidget from '../components/dashboard/PortfolioSummaryWidget';
import MarketStatsCards from '../components/dashboard/MarketStatsCards';
import TickerSearch from '../components/stock/TickerSearch';
import ApiWakeupLoader from '../components/loading/ApiWakeupLoader';
import { SkeletonCard, SkeletonChart } from '../components/loading/SkeletonLoader';
import toast from 'react-hot-toast';
import { TrendingUp, Briefcase, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const [marketCondition, setMarketCondition] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyPeriod, setHistoryPeriod] = useState(90);
  const [loading, setLoading] = useState(true);
  const [apiWaking, setApiWaking] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      // ---------------- Market Condition ----------------
      const startTime = Date.now();

      try {
        const response = await marketService.getMarketCondition();
        const elapsed = Date.now() - startTime;

        const conditionResult = response?.data ?? response;
        console.log('Dashboard market condition RAW:', conditionResult);
        console.log('Dashboard market condition keys:', Object.keys(conditionResult || {}));

        // Comprehensive mapping to handle Python API response structure
        // Python API returns: { current_regime: {id, label}, sp500_price, vix, ... }
        const enriched = {
          ...conditionResult,
          // Regime label mapping (Python API: current_regime.label)
          regime_label: conditionResult.current_regime?.label || 
                        conditionResult.regime_label || 
                        conditionResult.regimeLabel || 
                        conditionResult.regime?.label ||
                        conditionResult.label,
          regimeLabel: conditionResult.current_regime?.label || 
                       conditionResult.regime_label || 
                       conditionResult.regimeLabel || 
                       conditionResult.regime?.label ||
                       conditionResult.label,
          // Regime ID mapping (Python API: current_regime.id)
          regime_id: conditionResult.current_regime?.id ?? 
                     conditionResult.regime_id ?? 
                     conditionResult.regimeId ?? 
                     conditionResult.regime?.id ??
                     conditionResult.id ?? 0,
          regimeId: conditionResult.current_regime?.id ?? 
                    conditionResult.regime_id ?? 
                    conditionResult.regimeId ?? 
                    conditionResult.regime?.id ??
                    conditionResult.id ?? 0,
          // SPX price mapping (Python API: sp500_price)
          spx_price: conditionResult.sp500_price || 
                     conditionResult.spx_price || 
                     conditionResult.spxPrice || 
                     conditionResult.starting_price || 
                     conditionResult.price,
          spxPrice: conditionResult.sp500_price || 
                    conditionResult.spx_price || 
                    conditionResult.spxPrice || 
                    conditionResult.starting_price || 
                    conditionResult.price,
          // VIX mapping (Python API: vix)
          vix: conditionResult.vix || 
               conditionResult.vix_level || 
               conditionResult.vixLevel,
          vix_level: conditionResult.vix || 
                     conditionResult.vix_level || 
                     conditionResult.vixLevel,
          vixLevel: conditionResult.vix || 
                    conditionResult.vix_level || 
                    conditionResult.vixLevel,
          // Keep current_regime for reference
          current_regime: conditionResult.current_regime || {
            label: conditionResult.regime_label || conditionResult.regimeLabel || conditionResult.label,
            id: conditionResult.regime_id ?? conditionResult.regimeId ?? conditionResult.id ?? 0
          }
        };

        console.log('Dashboard market condition ENRICHED:', enriched);
        setMarketCondition(enriched);

        if (elapsed > 10000) {
          setApiWaking(true);
          setTimeout(() => setApiWaking(false), 2000);
        }
      } catch (marketError) {
        console.error('Market condition error:', marketError);

        setMarketCondition({
          regimeId: 0,
          regimeLabel: 'Unknown',
          spxPrice: null,
          vixLevel: null,
          confidence: 0,
          marketStatus: 'unavailable',
          _fallback: true,
        });

        toast.error('Market data temporarily unavailable', {
          duration: 3000,
        });
      }

      // ---------------- Regime History ----------------
      try {
        const historyResponse = await marketService.getRegimeHistory(historyPeriod);
        const historyResult = historyResponse.data || historyResponse;
        setHistory(historyResult.history || []);
      } catch (error) {
        console.log('History not available:', error);
      }

      // ---------------- Watchlist ----------------
      // Try to get from backend, fallback to localStorage
      if (user) {
        try {
          const watchlistResult = await watchlistService.getWatchlists();

          if (Array.isArray(watchlistResult) && watchlistResult.length > 0) {
            const defaultWatchlist =
              watchlistResult.find(w => w.isDefault) ?? watchlistResult[0];

            setWatchlist(defaultWatchlist?.stocks ?? []);
          } else {
            // Fallback to localStorage
            const localWatchlist = localStorage.getItem('user_watchlist');
            if (localWatchlist) {
              setWatchlist(JSON.parse(localWatchlist));
            }
          }
        } catch (error) {
          console.log('Using local watchlist:', error);
          const localWatchlist = localStorage.getItem('user_watchlist');
          if (localWatchlist) {
            setWatchlist(JSON.parse(localWatchlist));
          }
        }
      } else {
        // Not logged in, use localStorage
        const localWatchlist = localStorage.getItem('user_watchlist');
        if (localWatchlist) {
          setWatchlist(JSON.parse(localWatchlist));
        }
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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

  // ---------------- API Wake Loader ----------------
  if (apiWaking) {
    return <ApiWakeupLoader message="Initializing market data..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Welcome back, {user?.name || 'Trader'}!
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <TickerSearch />
      </div>

      {/* Regime History Chart */}
      {loading ? (
        <SkeletonChart />
      ) : history.length > 0 ? (
        <RegimeHistoryChart 
          data={history} 
          title="Market Regime History" 
          onPeriodChange={handlePeriodChange}
          initialPeriod={historyPeriod}
        />
      ) : null}

      {/* Portfolio Summary */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <PortfolioSummaryWidget />
      )}

      {/* Watchlist */}
      {user && (
        <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Your Watchlist
          </h3>

          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Your watchlist is empty</p>
              <p className="text-sm text-gray-500">
                Search for stocks and add them to your watchlist
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {watchlist.map(stock => (
                <a
                  key={stock.ticker}
                  href={`/stock/${stock.ticker}`}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <p className="font-bold text-lg text-cyan-400">
                    {stock.ticker}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {stock.company_name}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Explore Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureLink
            href="/market"
            title="Market Overview"
            description="View all market regimes and forecasts"
          />
          <FeatureLink
            href="/agent"
            title="AI Agent"
            description="Ask questions about stocks and markets"
          />
          <FeatureLink
            href="/portfolio"
            title="Portfolio Tracker"
            description="Track your investments and P&L"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-gray-500 border-t border-white/5">
        Market-level analysis based on historical regimes (1990–2022)
      </div>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function FeatureLink({ href, title, description }) {
  return (
    <a
      href={href}
      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all hover:border-cyan-500/50"
    >
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </a>
  );
}
