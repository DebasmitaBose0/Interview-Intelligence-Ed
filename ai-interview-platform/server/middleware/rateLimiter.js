const limitStore = new Map();

const rateLimiter = (maxRequests = 5, windowMs = 900000) => { // 5 requests per 15 minutes default
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!limitStore.has(ip)) {
      limitStore.set(ip, []);
    }

    const timestamps = limitStore.get(ip);
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    validTimestamps.push(now);
    limitStore.set(ip, validTimestamps);

    if (validTimestamps.length > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 15 minutes.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
