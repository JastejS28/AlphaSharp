import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import yahooFinanceService from '../../services/yahooFinanceService';

export default function PortfolioSummaryWidget() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLivePrices = async (savedPositions) => {
    if (savedPositions.length === 0) return savedPositions;

    try {
      const tickers = savedPositions.map(p => p.ticker);
      const quotes = await yahooFinanceService.getQuotes(tickers);

      return savedPositions.map(pos => {
        const quote = quotes.find(q => q.ticker === pos.ticker);
        if (quote && quote.data) {
          return {
            ...pos,
            currentPrice: quote.data.price || pos.currentPrice,
          };
        }
        return pos;
      });
    } catch (error) {
      console.error('Failed to fetch live prices:', error);
      return savedPositions;
    }
  };

  useEffect(() => {
    const loadPortfolio = async () => {
      const saved = localStorage.getItem('portfolio_positions');
      if (saved) {
        const savedPositions = JSON.parse(saved);
        const withLivePrices = await fetchLivePrices(savedPositions);
        setPositions(withLivePrices);
      }
      setLoading(false);
    };

    loadPortfolio();

    // Refresh every 30 seconds
    const interval = setInterval(loadPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate portfolio metrics
  const totalValue = positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
  const totalCost = positions.reduce((sum, pos) => sum + (pos.shares * pos.avgPrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const isPositive = totalGainLoss >= 0;

  // Top 3 holdings by value
  const topHoldings = [...positions]
    .sort((a, b) => (b.shares * b.currentPrice) - (a.shares * a.currentPrice))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Portfolio</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-2">No positions yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Start tracking your investments
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Add Position
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Portfolio</h3>
        </div>
        <Link
          to="/portfolio"
          className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Total Value */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <DollarSign className="w-5 h-5 text-cyan-400" />
          <span className="text-3xl font-bold text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ({isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
          </span>
          <span className="text-xs text-gray-400">Total P&L</span>
        </div>
      </div>

      {/* Top Holdings */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Top Holdings</h4>
        <div className="space-y-3">
          {topHoldings.map((position) => {
            const value = position.shares * position.currentPrice;
            const cost = position.shares * position.avgPrice;
            const gainLoss = value - cost;
            const gainLossPercent = (gainLoss / cost) * 100;
            const isPosPositive = gainLoss >= 0;
            const percentage = (value / totalValue) * 100;

            return (
              <div key={position.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">
                      {position.ticker}
                    </span>
                    <span className="text-xs text-gray-500">
                      {position.shares} shares
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${isPosPositive ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-medium text-white">
                    ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-xs ${isPosPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPosPositive ? '+' : ''}{gainLossPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Positions</span>
          <span className="font-medium text-white">{positions.length}</span>
        </div>
      </div>
    </div>
  );
}
