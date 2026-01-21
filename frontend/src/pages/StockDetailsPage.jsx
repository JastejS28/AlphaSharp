import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stockService } from '../services/stockService';
import { watchlistService } from '../services/watchlistService';
import { useAuth } from '../context/AuthContext';
import StockMetrics from '../components/stock/StockMetrics';
import NewsCard from '../components/stock/NewsCard';
import PeerComparison from '../components/stock/PeerComparison';
import StockPriceChart from '../components/charts/StockPriceChart';
import ApiWakeupLoader from '../components/loading/ApiWakeupLoader';
import { SkeletonCard, SkeletonChart } from '../components/loading/SkeletonLoader';
import toast from 'react-hot-toast';
import { ArrowLeft, Star, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function StockDetailsPage() {
  const { ticker } = useParams();
  const { user } = useAuth();
  const [stockData, setStockData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiWaking, setApiWaking] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    loadStockData();
    checkWatchlist();
  }, [ticker]);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      
      // Load stock analysis
      const analysisResponse = await stockService.getStockAnalysis(ticker);
      console.log('Stock analysis response:', analysisResponse);
      
      const analysisResult = analysisResponse.data || analysisResponse;
      console.log('Stock analysis result:', analysisResult);
      
      // Flatten the structure - merge raw_details into top level
      const flattenedData = {
        ...analysisResult,
        ...(analysisResult.raw_details || {}),
      };
      
      const elapsed = Date.now() - startTime;

      if (elapsed > 10000) {
        setApiWaking(true);
        setTimeout(() => setApiWaking(false), 2000);
      }

      setStockData(flattenedData);

      // Check if historical data is already in the analysis response
      if (flattenedData.historical_data) {
        console.log('Historical data found in analysis response');
      } else {
        // Try to load historical prices from Yahoo Finance endpoint
        try {
          const historyResponse = await stockService.getHistoricalPrices(ticker, '3mo');
          const historyResult = historyResponse.data || historyResponse;
          console.log('Historical prices from separate endpoint:', historyResult);
          
          if (historyResult.historical_data || historyResult.history) {
            setStockData(prev => ({
              ...prev,
              historical_data: historyResult.historical_data || historyResult.history,
            }));
          }
        } catch (error) {
          console.log('Historical prices endpoint not available - this is expected if Python API does not implement /api/stock/{ticker}/history');
        }
      }

      // Load news
      try {
        const newsResponse = await stockService.getStockNews(ticker, 5);
        console.log('Stock news response:', newsResponse);
        const newsResult = newsResponse.data || newsResponse;
        // Extract from news_data array if it exists
        const newsArticles = newsResult.news_data || newsResult.articles || newsResult.news || [];
        setNewsData(newsArticles);
      } catch (error) {
        console.log('News not available:', error);
      }
    } catch (error) {
      console.error('Stock data error:', error);
      toast.error(error.response?.data?.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlist = () => {
    try {
      const saved = localStorage.getItem('user_watchlist');
      if (saved) {
        const watchlist = JSON.parse(saved);
        const exists = watchlist.some(item => item.ticker === ticker.toUpperCase());
        setInWatchlist(exists);
      }
    } catch (error) {
      console.log('Could not check watchlist:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      toast.error('Please login to use watchlist');
      return;
    }

    try {
      // Use localStorage for watchlist (simpler, works without auth)
      const watchlistKey = 'user_watchlist';
      const saved = localStorage.getItem(watchlistKey);
      const watchlist = saved ? JSON.parse(saved) : [];

      if (inWatchlist) {
        // Remove from watchlist
        const updated = watchlist.filter(item => item.ticker !== ticker);
        localStorage.setItem(watchlistKey, JSON.stringify(updated));
        setInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        // Add to watchlist
        const newItem = {
          ticker,
          company_name: stockData?.company_name || ticker,
          addedAt: new Date().toISOString(),
        };
        watchlist.push(newItem);
        localStorage.setItem(watchlistKey, JSON.stringify(watchlist));
        setInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error);
      toast.error('Watchlist action failed');
    }
  };

  if (apiWaking) {
    return <ApiWakeupLoader message={`Loading ${ticker} data...`} />;
  }

  const getPriceChangeColor = () => {
    if (!stockData?.current_price || !stockData?.previous_close) return 'text-gray-400';
    const change = stockData.current_price - stockData.previous_close;
    return change >= 0 ? 'text-cyan-400' : 'text-red-400';
  };

  const getPriceChangeIcon = () => {
    if (!stockData?.current_price || !stockData?.previous_close) return <Activity className="w-6 h-6" />;
    const change = stockData.current_price - stockData.previous_close;
    return change >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />;
  };

  const calculatePriceChange = () => {
    if (!stockData?.current_price || !stockData?.previous_close) return { amount: 0, percent: 0 };
    const amount = stockData.current_price - stockData.previous_close;
    const percent = (amount / stockData.previous_close) * 100;
    return { amount, percent };
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Stock Header */}
      {loading ? (
        <SkeletonCard />
      ) : stockData ? (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-white">{ticker.toUpperCase()}</h1>
                {user && (
                  <button
                    onClick={toggleWatchlist}
                    className={`p-2 rounded-lg transition-colors ${
                      inWatchlist 
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
              <p className="text-xl text-gray-400">{stockData.company_name}</p>
              <p className="text-sm text-gray-500 mt-1">{stockData.sector} • {stockData.industry}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                ${stockData.current_price?.toFixed(2) || 'N/A'}
              </p>
              <div className={`flex items-center gap-2 mt-2 ${getPriceChangeColor()}`}>
                {getPriceChangeIcon()}
                <div>
                  <p className="text-lg font-semibold">
                    {calculatePriceChange().amount >= 0 ? '+' : ''}
                    ${calculatePriceChange().amount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    ({calculatePriceChange().percent >= 0 ? '+' : ''}
                    {calculatePriceChange().percent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {stockData.description && (
            <p className="text-gray-400 mt-4 leading-relaxed">
              {stockData.description}
            </p>
          )}
        </div>
      ) : null}

      {/* Key Metrics */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <StockMetrics data={stockData} />
      )}

      

      {/* News */}
      {loading ? (
        <SkeletonChart />
      ) : (
        <NewsCard articles={newsData} />
      )}

      {/* Peer Comparison */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <PeerComparison peers={stockData?.peers} />
      )}
    </div>
  );
}
