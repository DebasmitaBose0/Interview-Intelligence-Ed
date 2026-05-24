const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Legacy auth routes removed. Auth is handled statelessly via Firebase on the frontend.
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

module.exports = router;