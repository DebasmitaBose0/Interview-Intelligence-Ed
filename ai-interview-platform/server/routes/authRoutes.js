const auditLogger = require('../middleware/auditMiddleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validators/validateMiddleware');
const {
  forgotPasswordValidator,
  verifyOTPValidator,
  resendOTPValidator,
  syncUserValidator,
} = require('../middleware/validators/authValidators');

const otpLimiter = rateLimiter(3, 15 * 60 * 1000);

router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

router.post('/forgot-password', otpLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/verify-otp', otpLimiter, verifyOTPValidator, validate, authController.verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTPValidator, validate, authController.resendOTP);
router.post('/refresh', authController.refreshToken);
router.post('/sync-user', syncUserValidator, validate, authController.syncUser);

module.exports = router;