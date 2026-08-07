const mongoose = require('mongoose');

function getDatabaseDiagnostics() {
  const connectionStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateCode = mongoose.connection.readyState;
  const isConnected = stateCode === 1;

  const memoryUsage = process.memoryUsage();

  return {
    status: isConnected ? 'healthy' : 'degraded',
    database: {
      state: connectionStateMap[stateCode] || 'unknown',
      host: mongoose.connection.host || 'none',
      name: mongoose.connection.name || 'none',
    },
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      memoryRssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      nodeVersion: process.version,
    },
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  getDatabaseDiagnostics,
};
