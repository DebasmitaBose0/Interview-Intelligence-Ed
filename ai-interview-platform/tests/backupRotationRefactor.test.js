const { rotateBackups } = require('../server/services/backupRotation');

describe('Backup Rotation Service Suite', () => {
  test('rotateBackups returns success object structure', () => {
    const result = rotateBackups(5);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('message');
  });
});
