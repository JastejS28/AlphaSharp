import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';
import { CACHE_TIMES } from '../utils/constants';

export const useMarketCondition = (options = {}) => {
  return useQuery({
    queryKey: ['marketCondition'],
    queryFn: () => marketService.getMarketCondition(),
    staleTime: CACHE_TIMES.MARKET_REGIME,
    ...options,
  });
};

export const useRegimeForecast = (days = 60, simulations = 2000, includePaths = false, options = {}) => {
  return useQuery({
    queryKey: ['regimeForecast', days, simulations, includePaths],
    queryFn: () => marketService.getRegimeForecast(days, simulations, includePaths),
    staleTime: CACHE_TIMES.FORECAST,
    ...options,
  });
};

export const useShortTermPrediction = (days = 5, options = {}) => {
  return useQuery({
    queryKey: ['shortTermPrediction', days],
    queryFn: () => marketService.getShortTermPrediction(days),
    staleTime: CACHE_TIMES.FORECAST,
    ...options,
  });
};

export const useAllRegimes = (options = {}) => {
  return useQuery({
    queryKey: ['allRegimes'],
    queryFn: () => marketService.getAllRegimes(),
    staleTime: Infinity, // Never stale (static data)
    ...options,
  });
};

export const useRegimeHistory = (daysBack = 60, options = {}) => {
  return useQuery({
    queryKey: ['regimeHistory', daysBack],
    queryFn: () => marketService.getRegimeHistory(daysBack),
    staleTime: CACHE_TIMES.MARKET_REGIME,
    ...options,
  });
};
