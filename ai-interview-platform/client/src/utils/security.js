/**
 * Enhanced Security & Sanitization Utilities
 *
 * Provides string escaping, HTML sanitization, input validation, code control-character
 * stripping, and password strength checks across client components.
 */

/**
 * Escapes HTML entity special characters to prevent XSS injection.
 *
 * @param {string} input
 * @returns {string}
 */
export function sanitizeHtml(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips HTML tags and script blocks for safe text display rendering.
 *
 * @param {string} input
 * @returns {string}
 */
export function sanitizeForDisplay(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Validates whether a string contains numeric digits up to specified max length.
 *
 * @param {string} text
 * @param {number} [maxLength=6]
 * @returns {boolean}
 */
export function isValidNumeric(text, maxLength = 6) {
  if (typeof text !== 'string') return false;
  return /^\d+$/.test(text) && text.length <= maxLength;
}

/**
 * Validates email format syntax.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Truncates text string to specified maximum length.
 *
 * @param {string} str
 * @param {number} [maxLength=500]
 * @returns {string}
 */
export function truncate(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

/**
 * Validates password strength (requires >= 8 chars, uppercase, lowercase, and digit).
 *
 * @param {string} password
 * @returns {boolean}
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string' || password.length < 8) return false;
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

/**
 * Strips non-printable ASCII control characters from code string inputs.
 *
 * @param {string} code
 * @returns {string}
 */
export function sanitizeCode(code) {
  if (typeof code !== 'string') return '';
  return code.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, '');
}

const security = {
  sanitizeHtml,
  sanitizeForDisplay,
  isValidNumeric,
  isValidEmail,
  truncate,
  validatePasswordStrength,
  sanitizeCode,
};

export default security;
