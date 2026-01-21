import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistService } from '../services/watchlistService';
import toast from 'react-hot-toast';

export const useWatchlists = (options = {}) => {
  return useQuery({
    queryKey: ['watchlists'],
    queryFn: () => watchlistService.getWatchlists(),
    ...options,
  });
};

export const useWatchlist = (id, options = {}) => {
  return useQuery({
    queryKey: ['watchlist', id],
    queryFn: () => watchlistService.getWatchlist(id),
    enabled: !!id,
    ...options,
  });
};

export const useWatchlistWithData = (id, options = {}) => {
  return useQuery({
    queryKey: ['watchlistWithData', id],
    queryFn: () => watchlistService.getWatchlistWithData(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, stocks, isDefault }) =>
      watchlistService.createWatchlist(name, stocks, isDefault),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast.success('Watchlist created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create watchlist');
    },
  });
};

export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => watchlistService.updateWatchlist(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      queryClient.invalidateQueries({ queryKey: ['watchlist', variables.id] });
      toast.success('Watchlist updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update watchlist');
    },
  });
};

export const useDeleteWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => watchlistService.deleteWatchlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast.success('Watchlist deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete watchlist');
    },
  });
};

export const useAddStockToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ watchlistId, ticker, notes }) =>
      watchlistService.addStock(watchlistId, ticker, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', variables.watchlistId] });
      queryClient.invalidateQueries({ queryKey: ['watchlistWithData', variables.watchlistId] });
      toast.success('Stock added to watchlist');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add stock');
    },
  });
};

export const useRemoveStockFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ watchlistId, ticker }) =>
      watchlistService.removeStock(watchlistId, ticker),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', variables.watchlistId] });
      queryClient.invalidateQueries({ queryKey: ['watchlistWithData', variables.watchlistId] });
      toast.success('Stock removed from watchlist');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove stock');
    },
  });
};
