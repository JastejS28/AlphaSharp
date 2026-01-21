import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { stockService } from '../../services/stockService';
import toast from 'react-hot-toast';

export default function TickerSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a stock ticker');
      return;
    }

    setLoading(true);
    try {
      const response = await stockService.searchStock(query.trim().toUpperCase());
      const result = response.data || response;
      
      if (result.results && result.results.length > 0) {
        setResults(result.results);
        setShowDropdown(true);
      } else {
        toast.error('No stocks found');
        setResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Search failed');
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (symbol) => {
    setQuery('');
    setShowDropdown(false);
    setResults([]);
    navigate(`/stock/${symbol}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks (e.g., AAPL, TSLA, MSFT)..."
          className="w-full px-4 py-3 pl-12 border border-white/10 bg-gray-900/50 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500"
          disabled={loading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-600 transition-colors font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-900/95 border border-white/10 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            {results.map((stock, index) => (
              <button
                key={index}
                onClick={() => handleSelectStock(stock.symbol)}
                className="w-full text-left px-3 py-3 hover:bg-gray-800/50 rounded-md transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-400">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-white">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {stock.exch}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
