const admin = require('firebase-admin');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }
    const token = authHeader.split(' ')[1];
    // In development mode only, accept a demo token for local testing
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEMO_TOKEN === 'true' && token === 'demo_token_active') {
      console.warn('[Auth] Demo token accepted in development mode. Do not use in production.');
      req.user = { uid: 'demo_uid', _id: 'demo_uid', role: 'admin' };
      return next();
    }
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { ...decoded, _id: decoded.uid };
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    res.status(401).json({ success: false, message: 'Authentication failed. Invalid or expired token.' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ success: false, message: 'Access denied: Administrators only' });
};
