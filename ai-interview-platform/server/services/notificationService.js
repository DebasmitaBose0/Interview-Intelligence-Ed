const sendEmail = require('../utils/emailService');

class NotificationService {
  static async sendOTP(email, otp) {
    return await sendEmail({
      email,
      subject: 'Password Reset OTP',
      message: `Your password reset OTP is ${otp}. It is valid for 5 minutes.`
    });
  }

  static async sendInterviewConfirmation(email, date) {
    return await sendEmail({
      email,
      subject: 'Interview Scheduled',
      message: `Your interview is scheduled for ${date}`
    });
  }
}

// Attach static methods to the main function to support both import paradigms
sendEmail.sendOTP = NotificationService.sendOTP;
sendEmail.sendInterviewConfirmation = NotificationService.sendInterviewConfirmation;

module.exports = sendEmail;

