/**
 * Test Utilities Helper
 * Provides mock req/res objects and synthetic JWT tokens for testing server controllers.
 */

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

function createMockReq(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: { _id: 'mock_user_123', email: 'test@example.com' },
    ...overrides
  };
}

module.exports = {
  createMockRes,
  createMockReq
};
