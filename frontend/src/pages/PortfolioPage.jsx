import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Percent, Plus, X, Download, RefreshCw } from 'lucide-react';
import PortfolioPerformanceChart from '../components/charts/PortfolioPerformanceChart';
import yahooFinanceService from '../services/yahooFinanceService';
import toast from 'react-hot-toast';

export default function PortfolioPage() {
  const [positions, setPositions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newPosition, setNewPosition] = useState({
    ticker: '',
    shares: '',
    avgPrice: '',
  });

  // Calculate portfolio metrics
  const totalValue = positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
  const totalCost = positions.reduce((sum, pos) => sum + (pos.shares * pos.avgPrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  // Generate chart data - simulate historical performance
  const generateChartData = () => {
    if (positions.length === 0) return [];
    
    const days = 30;
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate slight price fluctuation over time
      const fluctuation = 1 + (Math.random() - 0.5) * 0.02; // +/- 1% random
      const simulatedValue = totalCost * (1 + (totalGainLossPercent / 100) * (1 - i / days)) * fluctuation;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.max(simulatedValue, totalCost * 0.9),
        cost: totalCost,
      });
    }
    
    return data;
  };

  const fetchLivePrices = async () => {
    if (positions.length === 0) return;

    setRefreshing(true);
    try {
      const tickers = positions.map(p => p.ticker);
      console.log('🔍 Fetching prices for tickers:', tickers);
      
      const quotes = await yahooFinanceService.getQuotes(tickers);
      console.log('📊 Received quotes:', quotes);

      const updated = positions.map(pos => {
        const quote = quotes.find(q => q.ticker === pos.ticker);
        console.log(`🔎 Processing ${pos.ticker}:`, {
          found: !!quote,
          hasData: !!quote?.data,
          dataStructure: quote?.data,
          extractedPrice: quote?.data?.data?.price || quote?.data?.price,
          currentPrice: pos.currentPrice
        });

        if (quote && quote.data) {
          const newPrice = quote.data.data?.price || quote.data.price || pos.currentPrice;
          console.log(`💰 ${pos.ticker}: ${pos.currentPrice} → ${newPrice}`);
          
          return {
            ...pos,
            currentPrice: newPrice,
          };
        }
        return pos;
      });

      console.log('✅ Updated positions:', updated);
      setPositions(updated);
      localStorage.setItem('portfolio_positions', JSON.stringify(updated));
      toast.success('Prices updated');
    } catch (error) {
      console.error('❌ Failed to fetch live prices:', error);
      toast.error('Failed to update prices');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddPosition = async (e) => {
    e.preventDefault();
    
    try {
      // Fetch current price
      const quote = await yahooFinanceService.getQuote(newPosition.ticker.toUpperCase());
      
      const position = {
        id: Date.now(),
        ticker: newPosition.ticker.toUpperCase(),
        shares: parseFloat(newPosition.shares),
        avgPrice: parseFloat(newPosition.avgPrice),
        currentPrice: quote.price || parseFloat(newPosition.avgPrice),
        addedAt: new Date(),
      };

      setPositions([...positions, position]);
      
      // Save to localStorage
      const saved = [...positions, position];
      localStorage.setItem('portfolio_positions', JSON.stringify(saved));
      
      toast.success(`Added ${position.ticker} to portfolio`);
      setShowAddModal(false);
      setNewPosition({ ticker: '', shares: '', avgPrice: '' });
    } catch (error) {
      console.error('Failed to add position:', error);
      toast.error('Failed to fetch stock data');
    }
  };

  const handleRemovePosition = (id) => {
    const updated = positions.filter(p => p.id !== id);
    setPositions(updated);
    localStorage.setItem('portfolio_positions', JSON.stringify(updated));
    toast.success('Position removed');
  };

  const handleExportCSV = () => {
    const headers = ['Ticker', 'Shares', 'Avg Price', 'Current Price', 'Value', 'Gain/Loss', 'Gain/Loss %'];
    const rows = positions.map(pos => {
      const value = pos.shares * pos.currentPrice;
      const cost = pos.shares * pos.avgPrice;
      const gainLoss = value - cost;
      const gainLossPercent = (gainLoss / cost) * 100;
      
      return [
        pos.ticker,
        pos.shares,
        pos.avgPrice.toFixed(2),
        pos.currentPrice.toFixed(2),
        value.toFixed(2),
        gainLoss.toFixed(2),
        gainLossPercent.toFixed(2) + '%',
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Portfolio exported');
  };

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_positions');
    if (saved) {
      setPositions(JSON.parse(saved));
    }
  }, []);

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    if (positions.length === 0) return;

    // Initial fetch
    fetchLivePrices();

    // Set up interval
    const interval = setInterval(fetchLivePrices, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [positions.length]); // Only re-run when positions count changes

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Portfolio Tracker
              </h1>
              <p className="text-gray-400">
                Monitor your investments and track performance
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchLivePrices}
              disabled={positions.length === 0 || refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Updating...' : 'Refresh Prices'}
            </button>
            
            <button
              onClick={handleExportCSV}
              disabled={positions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Position
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Total Value</p>
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-400">Total Cost</p>
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className={`w-5 h-5 ${totalGainLoss >= 0 ? 'text-cyan-400' : 'text-red-400'}`} />
              <p className="text-sm text-gray-400">Gain/Loss</p>
            </div>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Percent className={`w-5 h-5 ${totalGainLossPercent >= 0 ? 'text-cyan-400' : 'text-red-400'}`} />
              <p className="text-sm text-gray-400">Return %</p>
            </div>
            <p className={`text-2xl font-bold ${totalGainLossPercent >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Performance Chart */}
        <PortfolioPerformanceChart 
          data={generateChartData()}
        />

        {/* Positions Table */}
        <div className="bg-gray-900/50 rounded-lg border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Positions</h2>
          </div>

          {positions.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No positions yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add Your First Position
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ticker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-white/10">
                  {positions.map((pos) => {
                    const value = pos.shares * pos.currentPrice;
                    const cost = pos.shares * pos.avgPrice;
                    const gainLoss = value - cost;
                    const gainLossPercent = (gainLoss / cost) * 100;

                    return (
                      <tr key={pos.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-cyan-400">
                            {pos.ticker}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          {pos.shares.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          ${pos.avgPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          ${pos.currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          ${value.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={gainLoss >= 0 ? 'text-cyan-400' : 'text-red-400'}>
                            <div className="font-semibold">
                              {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                            </div>
                            <div className="text-sm">
                              ({gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleRemovePosition(pos.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Add Position
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPosition} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  required
                  value={newPosition.ticker}
                  onChange={(e) => setNewPosition({ ...newPosition, ticker: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500 uppercase"
                  placeholder="AAPL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Number of Shares
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={newPosition.shares}
                  onChange={(e) => setNewPosition({ ...newPosition, shares: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Average Price
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={newPosition.avgPrice}
                  onChange={(e) => setNewPosition({ ...newPosition, avgPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500"
                  placeholder="150.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
                >
                  Add Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
