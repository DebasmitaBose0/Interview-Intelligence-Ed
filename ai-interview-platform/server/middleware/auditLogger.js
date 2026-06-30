const logger = require('../utils/logger');

const auditLogger = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      ip,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent']
    };

    if (res.statusCode >= 400) {
      logger.warn(`API Request Failure: ${req.method} ${req.originalUrl}`, logData);
    } else {
      logger.info(`API Request Success: ${req.method} ${req.originalUrl}`, logData);
    }
  });

  next();
};

module.exports = auditLogger;
