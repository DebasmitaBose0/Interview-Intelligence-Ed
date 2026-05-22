const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const questionController = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// Secure all interview routing vectors using JWT protect middleware
router.post('/start', protect, interviewController.startInterview);
router.post('/answer', protect, interviewController.submitAnswer);
router.post('/questions', protect, questionController.generateQuestion);
router.post('/coding/eval', protect, interviewController.evaluateCode);

module.exports = router;