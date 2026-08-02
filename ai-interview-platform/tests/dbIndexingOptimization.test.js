const Interview = require('../server/models/Interview');
const CustomQuestionSet = require('../server/models/CustomQuestionSet');

describe('Database Index Optimization Verification', () => {
  test('Interview schema indexes contain compound query index', () => {
    const indexes = Interview.schema.indexes();
    const hasStatusIndex = indexes.some(idx => idx[0].status === 1 && idx[0].createdAt === -1);
    expect(hasStatusIndex).toBe(true);
  });

  test('CustomQuestionSet schema indexes contain compound user active index', () => {
    const indexes = CustomQuestionSet.schema.indexes();
    const hasUserActiveIndex = indexes.some(idx => idx[0].userId === 1 && idx[0].isActive === 1);
    expect(hasUserActiveIndex).toBe(true);
  });
});
