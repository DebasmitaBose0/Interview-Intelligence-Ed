const request = require('supertest');
const app = require('../server/app');

describe('Server Integration & Health Endpoints', () => {
  test('GET / returns 200 OK and running status string', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('AI Interview Platform API is running');
  });

  test('GET /api/health returns health status object', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
