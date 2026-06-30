const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, 'audit.log');

const writeLog = (level, message, context = {}) => {
  const logMessage = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  }) + '\n';

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error('[Logger Error] Failed to write log:', err.message);
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${level.toUpperCase()}] ${message}`, Object.keys(context).length ? context : '');
  }
};

module.exports = {
  info: (msg, ctx) => writeLog('info', msg, ctx),
  warn: (msg, ctx) => writeLog('warn', msg, ctx),
  error: (msg, ctx) => writeLog('error', msg, ctx),
  security: (msg, ctx) => writeLog('security', msg, ctx)
};
