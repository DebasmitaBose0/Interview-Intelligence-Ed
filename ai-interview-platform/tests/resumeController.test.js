const { createMockReq, createMockRes } = require('./testUtils');
const resumeController = require('../server/controllers/resumeController');

describe('Resume Controller Unit Tests', () => {
  test('getResumeStatus or uploadResume handles request validation', async () => {
    const req = createMockReq();
    const res = createMockRes();

    await resumeController.uploadResume(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });
});
