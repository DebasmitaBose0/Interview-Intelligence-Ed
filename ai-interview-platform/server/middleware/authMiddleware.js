const admin = require('firebase-admin');
const logger = require('../services/logger');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }
    const token = authHeader.split(' ')[1];
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEMO_TOKEN === 'true' && token === 'demo_token_active') {
      logger.warn('Demo token accepted in development mode.');
      req.user = { uid: 'demo_uid', _id: 'demo_uid', role: 'admin' };
      return next();
    }
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { ...decoded, _id: decoded.uid };
    req.userId = decoded.uid;
    next();
  } catch (err) {
    logger.error('Token verification failed', { error: err.message });
    res.status(401).json({ success: false, message: 'Authentication failed. Invalid or expired token.' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ success: false, message: 'Access denied: Administrators only' });
};
