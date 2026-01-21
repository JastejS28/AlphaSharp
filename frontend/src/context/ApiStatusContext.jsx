import { createContext, useContext, useState, useEffect } from 'react';
import { marketService } from '../services/marketService';
import { KEEP_ALIVE_INTERVAL, ENABLE_KEEP_ALIVE_PING } from '../utils/constants';

const ApiStatusContext = createContext(null);

export const ApiStatusProvider = ({ children }) => {
  const [apiStatus, setApiStatus] = useState({
    isWarm: false,
    isLoading: false,
    lastChecked: null,
    error: null,
  });

  // Ping API to check status
  const pingApi = async () => {
    try {
      const response = await marketService.getApiStatus();
      setApiStatus({
        isWarm: response.data.isWarm,
        isLoading: false,
        lastChecked: new Date(),
        error: null,
      });
      return response.data;
    } catch (error) {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return null;
    }
  };

  // Initial ping on mount
  useEffect(() => {
    pingApi();
  }, []);

  // Keep-alive pings
  useEffect(() => {
    if (!ENABLE_KEEP_ALIVE_PING) return;

    const interval = setInterval(() => {
      pingApi();
    }, KEEP_ALIVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const value = {
    apiStatus,
    pingApi,
    isApiWarm: apiStatus.isWarm,
  };

  return <ApiStatusContext.Provider value={value}>{children}</ApiStatusContext.Provider>;
};

export const useApiStatus = () => {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error('useApiStatus must be used within ApiStatusProvider');
  }
  return context;
};
