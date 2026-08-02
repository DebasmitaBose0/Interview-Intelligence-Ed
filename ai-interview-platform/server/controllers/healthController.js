const { isDatabaseConnected } = require('../utils/database');
const { sendSuccess, handleControllerError } = require('../utils/apiResponse');
const logger = require('../services/logger');

exports.getHealthStatus = async (req, res, next) => {
  try {
    const startTime = Date.now();
    const dbConnected = isDatabaseConnected();
    const dbLatencyMs = dbConnected ? (Date.now() - startTime) : null;

    const health = {
      status: 'healthy',
      uptime: `${process.uptime().toFixed(2)}s`,
      memory: process.memoryUsage(),
      database: {
        connected: dbConnected,
        type: dbConnected ? 'mongodb' : 'file-storage',
        pingLatencyMs: dbLatencyMs,
      },
      timestamp: new Date().toISOString()
    };
    logger.info('Health check requested', { databaseConnected: dbConnected, pingLatencyMs: dbLatencyMs });
    sendSuccess(res, health, 200, 'Service is healthy');
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    handleControllerError(res, error, 'Failed to get health status');
  }
};