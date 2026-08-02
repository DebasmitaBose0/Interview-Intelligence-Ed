describe('Architecture Documentation Integrity Suite', () => {
  test('ARCHITECTURE.md contains security and operational section', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.join(__dirname, '../ARCHITECTURE.md'), 'utf8');
    expect(content).toContain('Security & Operational Enhancements');
    expect(content).toContain('Rate Limiting');
  });
});
