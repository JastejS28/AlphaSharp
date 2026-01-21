import cron from 'node-cron';
import { config } from '../config/env.js';
import pythonApiService from './pythonApiService.js';
import logger from '../utils/logger.js';

let keepAliveJob = null;

// Check if it's market hours (9 AM - 6 PM EST)
const isMarketHours = () => {
  const now = new Date();
  const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hour = estTime.getHours();
  const day = estTime.getDay();
  
  // Weekend check (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) {
    return false;
  }
  
  // Market hours: 9 AM - 6 PM EST
  return hour >= 9 && hour < 18;
};

// Keep-alive ping function
const pingApi = async () => {
  if (!isMarketHours()) {
    logger.debug('Outside market hours - skipping keep-alive ping');
    return;
  }
  
  try {
    logger.debug('Sending keep-alive ping to Python API...');
    const result = await pythonApiService.healthCheck();
    
    if (result.success) {
      logger.info('✅ Keep-alive ping successful');
    } else {
      logger.warn(`⚠️ Keep-alive ping failed: ${result.error}`);
    }
  } catch (error) {
    logger.error(`❌ Keep-alive ping error: ${error.message}`);
  }
};

// Start keep-alive service
export const startKeepAlive = () => {
  if (!config.keepAlive.enabled) {
    logger.info('Keep-alive service is disabled');
    return;
  }
  
  const intervalMinutes = config.keepAlive.intervalMinutes;
  
  // Run immediately on startup
  setTimeout(() => {
    logger.info('Initial keep-alive ping...');
    pingApi();
  }, 5000); // Wait 5 seconds after server starts
  
  // Schedule cron job: every X minutes
  const cronExpression = `*/${intervalMinutes} * * * *`;
  
  keepAliveJob = cron.schedule(cronExpression, () => {
    pingApi();
  });
  
  logger.info(`✅ Keep-alive service started (every ${intervalMinutes} minutes during market hours)`);
};

// Stop keep-alive service
export const stopKeepAlive = () => {
  if (keepAliveJob) {
    keepAliveJob.stop();
    logger.info('Keep-alive service stopped');
  }
};

// Manual trigger (for testing)
export const triggerKeepAlive = async () => {
  logger.info('Manual keep-alive trigger');
  await pingApi();
};

export default {
  start: startKeepAlive,
  stop: stopKeepAlive,
  trigger: triggerKeepAlive,
};
