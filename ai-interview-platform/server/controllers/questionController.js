const questionTemplateEngine = require('../services/questionTemplateEngine');
const { sendSuccess, handleControllerError } = require('../utils/apiResponse');

exports.getQuestionBanks = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const banks = await questionTemplateEngine.getTemplatesByCategory(category, difficulty);
    sendSuccess(res, { count: banks.length, banks });
  } catch (error) {
    handleControllerError(res, error, 'Failed to retrieve question banks');
  }
};

exports.createQuestionBank = async (req, res, next) => {
  try {
    const bank = await questionTemplateEngine.createQuestionBank(req.body, req.user?._id);
    sendSuccess(res, bank, 'Question bank created successfully', 201);
  } catch (error) {
    handleControllerError(res, error, 'Failed to create question bank');
  }
};

exports.generateQuestion = async (req, res, next) => {
  try {
    const { role, difficulty } = req.body;
    const banks = await questionTemplateEngine.getTemplatesByCategory(role, difficulty);
    const questions = banks.length > 0 ? questionTemplateEngine.selectRandomQuestions(banks[0], 5) : [];
    sendSuccess(res, { role, difficulty, questions });
  } catch (error) {
    handleControllerError(res, error, 'Failed to generate questions');
  }
};