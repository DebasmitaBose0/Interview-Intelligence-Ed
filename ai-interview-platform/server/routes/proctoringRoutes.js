import express from 'express';
import { logProctorViolation, getProctorLogs, verifyCandidateIdentity } from '../controllers/proctoringController.js';

const router = express.Router();

router.post('/violations', logProctorViolation);
router.get('/logs/:interviewId', getProctorLogs);
router.post('/verify-identity', verifyCandidateIdentity);

export default router;
