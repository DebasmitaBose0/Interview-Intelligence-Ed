const sendEmail = require('../utils/emailService');

const send = async ({ to, subject, message, channel = 'email' }) => {
  console.log(`[Notification Service] Dispatching notification to: ${to} via ${channel}`);

  if (channel === 'email') {
    try {
      await sendEmail({ email: to, subject, message });
      return { success: true, channel: 'email' };
    } catch (err) {
      console.warn('[Notification Service Error] Email channel failed, falling back to console logging:', err.message);
    }
  }

  // Fallback to console trace logging
  console.log(`[Notification Dispatch Fallback] TO: ${to} | SUBJECT: ${subject} | MESSAGE: ${message}`);
  return { success: true, channel: 'console' };
};

module.exports = { send };
