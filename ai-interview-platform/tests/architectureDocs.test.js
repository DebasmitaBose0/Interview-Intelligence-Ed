const fs = require('fs');
const path = require('path');

describe('Architecture & API Documentation Integrity Suite', () => {
  test('ARCHITECTURE.md contains security and operational section', () => {
    let filePath = path.join(__dirname, '../../ARCHITECTURE.md');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../ARCHITECTURE.md');
    }
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('Security & Operational Enhancements');
    expect(content).toContain('Rate Limiting');
  });

  test('API_SPECIFICATION.md exists and documents health and diagnostics endpoints', () => {
    let filePath = path.join(__dirname, '../../docs/API_SPECIFICATION.md');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../docs/API_SPECIFICATION.md');
    }
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('GET /api/health/diagnostics');
    expect(content).toContain('POST /api/auth/verify-otp');
  });
});
