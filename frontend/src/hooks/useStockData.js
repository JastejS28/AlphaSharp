import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services/stockService';
import { CACHE_TIMES } from '../utils/constants';

export const useStockAnalysis = (ticker, options = {}) => {
  return useQuery({
    queryKey: ['stockAnalysis', ticker],
    queryFn: () => stockService.getStockAnalysis(ticker),
    staleTime: CACHE_TIMES.STOCK_ANALYSIS,
    enabled: !!ticker,
    ...options,
  });
};

export const useStockNews = (ticker, maxNews = 5, options = {}) => {
  return useQuery({
    queryKey: ['stockNews', ticker, maxNews],
    queryFn: () => stockService.getStockNews(ticker, maxNews),
    staleTime: CACHE_TIMES.MARKET_NEWS,
    enabled: !!ticker,
    ...options,
  });
};

export const useTickerSearch = () => {
  return useMutation({
    mutationFn: (query) => stockService.searchTicker(query),
  });
};

export const useSearchHistory = (options = {}) => {
  return useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => stockService.getSearchHistory(),
    ...options,
  });
};
