const { synthesizeInterviewReport } = require('../services/geminiService');

// @desc    Synthesize and retrieve detailed performance report using Gemini AI
// @route   POST /api/report/synthesize
// @access  Private
exports.synthesizeReport = async (req, res) => {
  try {
    const { role, experience, questions, answers } = req.body;

    console.log(`[Report Synthesizer] Calling Gemini to evaluate full transcript statelessly`);

    // Build Q&A list for Gemini
    const transcript = [];
    if (questions && questions.length > 0) {
      questions.forEach((q, idx) => {
        transcript.push({
          questionText: q.questionText || q,
          candidateAnswer: answers && answers[idx] ? answers[idx] : '(No answer provided)',
          category: q.category || 'technical'
        });
      });
    }

    // Get Gemini-powered evaluation
    const aiReport = await synthesizeInterviewReport({
      role: role || 'Software Engineer',
      experience: experience || 'Mid-level',
      qaList: transcript.length > 0 ? transcript : [{ questionText: 'General Tech', candidateAnswer: 'N/A' }]
    });

    const breakdown = {
      syntaxAccuracy: aiReport.breakdown?.technicalDepth || aiReport.technicalScore,
      systemScalability: aiReport.breakdown?.problemSolvingApproach || Math.round(aiReport.technicalScore * 0.9),
      verbalCommunication: aiReport.breakdown?.communicationClarity || aiReport.communicationScore,
      complexityOptimization: aiReport.breakdown?.domainKnowledge || Math.round(aiReport.technicalScore * 0.95),
    };

    const feedbackLogs = [
      `Gemini AI completed comprehensive stateless evaluation.`
    ];

    const reportData = {
      overallScore: aiReport.overallScore,
      communicationScore: aiReport.communicationScore,
      technicalScore: aiReport.technicalScore,
      breakdown,
      strengths: aiReport.strengths || [],
      weaknesses: aiReport.weaknesses || [],
      feedbackReport: aiReport.feedbackReport || 'No detailed feedback available.',
      feedbackLogs,
      hiringRecommendation: aiReport.hiringRecommendation || 'Hire',
      hrScore: aiReport.hrScore || aiReport.communicationScore,
    };

    res.status(201).json({
      success: true,
      message: 'Gemini AI report synthesized successfully (stateless)',
      data: reportData,
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
    res.status(404).json({ success: false, message: 'Persistent reports are disabled in stateless mode.' });
  } catch (error) {
    console.error('Get Report Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};