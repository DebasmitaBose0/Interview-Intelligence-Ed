const request = require('supertest');
const app = require('../app');

describe('CI/CD Pipeline Integration Tests', () => {
  it('should respond to system root check endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('AI Interview Platform API is running...');
  });
});
