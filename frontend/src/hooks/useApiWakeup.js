import { useState, useEffect } from 'react';
import { useApiStatus } from '../context/ApiStatusContext';
import { COLD_START_THRESHOLD } from '../utils/constants';

export const useApiWakeup = () => {
  const { apiStatus, pingApi } = useApiStatus();
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wakeupProgress, setWakeupProgress] = useState(0);

  useEffect(() => {
    // If API is cold, start wakeup process
    if (!apiStatus.isWarm && !isWakingUp) {
      setIsWakingUp(true);
      
      // Simulate progress (50 seconds)
      const interval = setInterval(() => {
        setWakeupProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // 2% every second for 50 seconds
        });
      }, 1000);

      // Ping API
      pingApi().then(() => {
        setIsWakingUp(false);
        setWakeupProgress(100);
      });

      return () => clearInterval(interval);
    }
  }, [apiStatus.isWarm]);

  return {
    isWakingUp,
    wakeupProgress,
    isApiWarm: apiStatus.isWarm,
    apiStatus,
  };
};
