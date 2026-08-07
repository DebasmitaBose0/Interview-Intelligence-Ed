const fs = require('fs');
const path = require('path');

describe('Architecture Documentation Integrity Suite', () => {
  test('ARCHITECTURE.md contains security and operational section', () => {
    let filePath = path.join(__dirname, '../../ARCHITECTURE.md');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../ARCHITECTURE.md');
    }
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('Security & Operational Enhancements');
    expect(content).toContain('Rate Limiting');
  });
});
