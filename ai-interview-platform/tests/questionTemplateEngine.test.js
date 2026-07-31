const { compileQuestionPromptTemplate, PRESET_TEMPLATES } = require('../server/utils/questionTemplateEngine');

describe('Question Template Engine Utility', () => {
  test('compileQuestionPromptTemplate compiles proper categories and prompt string', () => {
    const config = compileQuestionPromptTemplate('Frontend Engineer', 'Senior', ['GraphQL']);

    expect(config.role).toBe('Frontend Engineer');
    expect(config.difficulty).toBe('Senior');
    expect(config.categories).toContain('GraphQL');
    expect(config.systemPrompt).toContain('Senior Frontend Engineer');
    expect(config.rubricWeights.technicalAccuracy).toBe(40);
  });

  test('PRESET_TEMPLATES defines fallback definitions for standard roles', () => {
    expect(PRESET_TEMPLATES['Backend Engineer']).toBeDefined();
    expect(PRESET_TEMPLATES['Backend Engineer'].categories).toContain('Distributed Systems');
  });
});
