const { generateCategorizedQuestions } = require('../services/ollamaService');

// @desc    Generate dynamic technical, HR and coding questions using Ollama LLM
// @route   POST /api/interview/questions
// @access  Private
exports.generateQuestion = async (req, res) => {
  try {
    const { role, difficulty, experience, jobDescription, resumeSkills } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ success: false, message: 'Please specify target role and experience' });
    }

    console.log(`[AI Question Generator] Generating dynamic questions for ${role}`);
    const categorizedQuestions = await generateCategorizedQuestions({
      role,
      experience,
      skills: resumeSkills || [],
      jobDescription: jobDescription || '',
    });

    res.json({
      success: true,
      data: {
        role,
        difficulty: difficulty || 'Medium',
        experience,
        ...categorizedQuestions
      }
    });
  } catch (error) {
    console.error('AI Question Generation Route Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};