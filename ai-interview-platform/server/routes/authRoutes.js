const auditLogger = require('../middleware/auditMiddleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

const otpLimiter = rateLimiter(3, 15 * 60 * 1000); // Max 3 requests per 15 minutes

const addDeprecationHeaders = (req, res, next) => {
  res.setHeader('X-API-Version', '1.0');
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Sunset', '2026-12-31');
  next();
};

router.use(addDeprecationHeaders);

// Stateless authentication endpoints mapping user JWT claims.
// Leverages the unified notification dispatch service for transactional recovery codes.
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

// Password Reset Routes protected by security rate limiters
router.post('/forgot-password', otpLimiter, authController.forgotPassword);
router.post('/verify-otp', otpLimiter, authController.verifyOTP);
router.post('/refresh', authController.refreshToken);

module.exports = router;