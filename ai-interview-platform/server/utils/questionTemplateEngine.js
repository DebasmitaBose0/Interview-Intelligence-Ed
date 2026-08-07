/**
 * Dynamic Question Template Engine
 * Builds structured AI generation prompts and evaluates candidate rubrics based on job role presets.
 */

const PRESET_TEMPLATES = {
  'Frontend Engineer': {
    categories: ['JavaScript/DOM', 'React/State', 'CSS/Performance', 'Web Vitals'],
    difficultyLevels: ['Junior', 'Mid-level', 'Senior', 'Staff'],
    rubricWeights: { technicalAccuracy: 40, problemSolving: 30, communication: 30 }
  },
  'Backend Engineer': {
    categories: ['Distributed Systems', 'Database Indexing', 'API Design', 'Security'],
    difficultyLevels: ['Junior', 'Mid-level', 'Senior', 'Architect'],
    rubricWeights: { technicalAccuracy: 45, problemSolving: 35, communication: 20 }
  },
  'Full Stack Engineer': {
    categories: ['System Design', 'Frontend State', 'Database Optimization', 'CI/CD'],
    difficultyLevels: ['Junior', 'Mid-level', 'Senior'],
    rubricWeights: { technicalAccuracy: 40, problemSolving: 40, communication: 20 }
  }
};

/**
 * Builds dynamic evaluation prompt for Gemini service.
 * @param {string} role - Targeted job role.
 * @param {string} difficulty - Target difficulty level.
 * @param {Array<string>} customSkills - Selected target skills.
 * @returns {Object} Compiled template config.
 */
function compileQuestionPromptTemplate(role = 'Frontend Engineer', difficulty = 'Mid-level', customSkills = []) {
  const templateConfig = PRESET_TEMPLATES[role] || PRESET_TEMPLATES['Frontend Engineer'];
  const categories = templateConfig.categories.concat(customSkills.filter(s => !templateConfig.categories.includes(s)));

  const systemPrompt = `Generate 5 structured technical interview questions for a ${difficulty} ${role} role focusing on categories: ${categories.join(', ')}. Format output as valid JSON.`;

  return {
    role,
    difficulty,
    categories,
    rubricWeights: templateConfig.rubricWeights,
    systemPrompt
  };
}

module.exports = {
  PRESET_TEMPLATES,
  compileQuestionPromptTemplate
};
