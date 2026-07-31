const { sanitizeString, sanitizeObject } = require('../server/middleware/inputSanitizer');

describe('Security & Input Sanitizer Middleware', () => {
  test('sanitizeString strips HTML script tags and harmful markup', () => {
    const maliciousInput = '<script>alert("xss")</script>Hello <b>World</b>';
    const cleanOutput = sanitizeString(maliciousInput);

    expect(cleanOutput).not.toContain('<script>');
    expect(cleanOutput).toBe('Hello World');
  });

  test('sanitizeObject cleans nested payload fields recursively', () => {
    const payload = {
      username: '  johndoe  ',
      bio: '<img src=x onerror=alert(1)>Developer',
      skills: ['<script>evil()</script>React', 'Node.js']
    };

    const sanitized = sanitizeObject(payload);
    expect(sanitized.username).toBe('johndoe');
    expect(sanitized.bio).toBe('Developer');
    expect(sanitized.skills[0]).toBe('React');
  });
});
