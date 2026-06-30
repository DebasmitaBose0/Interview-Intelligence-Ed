const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Stateless authentication endpoints mapping user JWT claims.
// Leverages the unified notification dispatch service for transactional recovery codes.
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

// Password Reset Routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;