const express = require('express');
const { getReport } = require('../controllers/reportController');
const { getSchedule } = require('../controllers/scheduleController');
const multer = require('multer');
const router = express.Router();

const interviewController = require('../controllers/interviewController');
const questionController = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const sandboxMiddleware = require('../middleware/sandboxMiddleware');
const { validate } = require('../middleware/validators/validateMiddleware');
const {
  startInterviewValidator,
  submitAnswerValidator,
  evaluateCodeValidator,
  analyzeResumeValidator,
  followUpValidator,
} = require('../middleware/validators/interviewValidators');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/start', protect, startInterviewValidator, validate, interviewController.startInterview);
router.post('/answer', protect, submitAnswerValidator, validate, interviewController.submitAnswer);
router.post('/follow-up', protect, followUpValidator, validate, interviewController.submitAnswerAndGenerateFollowUp);
router.post('/questions', protect, questionController.generateQuestion);
router.post('/coding/eval', protect, sandboxMiddleware.validateSandboxPayload, evaluateCodeValidator, validate, interviewController.evaluateCode);
router.post('/evaluate-answer', protect, interviewController.evaluateAnswerRealtime);
router.post('/telemetry', protect, interviewController.logTelemetry);
router.post('/analyze-resume', protect, upload.single('resume'), analyzeResumeValidator, validate, interviewController.analyzeResumeAndMatchSkills);

const { routeCacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/report/:id', routeCacheMiddleware(120), getReport);
router.get('/schedule/:id', routeCacheMiddleware(60), getSchedule);

module.exports = router;