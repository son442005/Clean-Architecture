// src/services/sms.service.js
class SMSService {
  async sendOTP(phoneNumber, otp) {
    console.log(`[SMS MOCK] Sending OTP ${otp} to ${phoneNumber}`);
    return { success: true, messageId: 'mock-sms-id' };
  }
}

export default new SMSService();
