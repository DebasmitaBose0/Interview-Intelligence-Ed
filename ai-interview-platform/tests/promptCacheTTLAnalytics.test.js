const PromptCache = require('../server/models/PromptCache');

describe('PromptCache Model Schema & TTL Analytics Suite', () => {
  test('PromptCache schema defines promptHash, hitCount, and lastAccessedAt fields', () => {
    const paths = PromptCache.schema.paths;
    expect(paths.promptHash).toBeDefined();
    expect(paths.hitCount).toBeDefined();
    expect(paths.lastAccessedAt).toBeDefined();
    expect(paths.createdAt.options.expires).toBe(86400);
  });

  test('PromptCache schema contains lastAccessedAt index', () => {
    const indexes = PromptCache.schema.indexes();
    const hasLastAccessedIndex = indexes.some(idx => idx[0].lastAccessedAt === -1);
    expect(hasLastAccessedIndex).toBe(true);
  });
});
