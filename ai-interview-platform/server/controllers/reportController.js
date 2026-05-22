const Report = require('../models/Report');
const Interview = require('../models/Interview');

// @desc    Synthesize and retrieve detailed performance report
// @route   POST /api/report/synthesize
// @access  Private
exports.synthesizeReport = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user ? req.user._id : '664e4ea4a93a40498eb79e2a';

    if (!interviewId) {
      return res.status(400).json({ success: false, message: 'Please specify interviewId' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    // Advanced heuristics mock score compilation based on track matching
    const scoreBreakdowns = {
      'Frontend Engineer': { syntaxAccuracy: 92, systemScalability: 85, verbalCommunication: 88, complexityOptimization: 90 },
      'Backend Engineer': { syntaxAccuracy: 95, systemScalability: 92, verbalCommunication: 84, complexityOptimization: 89 },
      'Fullstack Engineer': { syntaxAccuracy: 90, systemScalability: 88, verbalCommunication: 91, complexityOptimization: 86 },
      'AI / ML Engineer': { syntaxAccuracy: 93, systemScalability: 90, verbalCommunication: 87, complexityOptimization: 94 }
    };

    const breakdown = scoreBreakdowns[interview.role] || scoreBreakdowns['Frontend Engineer'];
    const overallScore = Math.round((breakdown.syntaxAccuracy + breakdown.systemScalability + breakdown.verbalCommunication + breakdown.complexityOptimization) / 4);

    const feedbackLogs = [
      `Candidate demonstrated excellent technical articulation of ${interview.role} parameters.`,
      `Optimal memory boundaries during standard complexity tests.`,
      `Speaking tempo and structural layout clear and production-grade.`
    ];

    // Check if report already exists for this interview
    let report = await Report.findOne({ interview: interviewId });
    if (!report) {
      report = await Report.create({
        user: userId,
        interview: interviewId,
        overallScore,
        breakdown,
        feedbackLogs,
      });
    }

    // Update interview status to completed
    interview.status = 'completed';
    await interview.save();

    res.status(201).json({
      success: true,
      message: 'Report synthesized successfully',
      data: report,
    });
  } catch (error) {
    console.error('Report Synthesis Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Retrieve report details
// @route   GET /api/report/:interviewId
// @access  Private
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ interview: req.params.interviewId }).populate('interview');
    if (!report) {
      return res.status(404).json({ success: false, message: 'Performance report not found for this session' });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get Report Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};