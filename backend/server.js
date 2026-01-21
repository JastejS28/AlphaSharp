import app from './src/app.js';
import { config } from './src/config/env.js';
import { connectDatabase } from './src/config/database.js';
import { startKeepAlive } from './src/services/keepAliveService.js';
import logger from './src/utils/logger.js';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Connect to database
await connectDatabase();

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
  logger.info(`📡 Frontend URL: ${config.frontendUrl}`);
  logger.info(`🐍 Python API URL: ${config.pythonApi.url}`);
  
  // Start keep-alive service
  startKeepAlive();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! 💥 Shutting down...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully...');
  
  server.close(() => {
    logger.info('Process terminated!');
  });
});
