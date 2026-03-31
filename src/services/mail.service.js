const { getTransporter } = require("../config/mail");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

const buildOtpEmailHtml = ({ name, otp, expiresInMinutes }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .otp { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb; text-align: center; margin: 24px 0; }
    .footer { font-size: 12px; color: #9ca3af; margin-top: 32px; text-align: center; }
    h2 { color: #111827; } p { color: #374151; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Xin chào, ${name}!</h2>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
    <p>Mã OTP của bạn là:</p>
    <div class="otp">${otp}</div>
    <p>Mã này có hiệu lực trong <strong>${expiresInMinutes} phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    <div class="footer">© ${new Date().getFullYear()} Auth System. All rights reserved.</div>
  </div>
</body>
</html>`;

class MailService {
  async sendPasswordResetOtp({ to, name, otp, expiresInMinutes = 10 }) {
    const mailOptions = {
      from: process.env.MAIL_FROM || `"Auth System" <${process.env.MAIL_USER}>`,
      to,
      subject: "Mã OTP đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong ${expiresInMinutes} phút.`,
      html: buildOtpEmailHtml({ name, otp, expiresInMinutes }),
    };

    try {
      const transporter = getTransporter();
      const info = await transporter.sendMail(mailOptions);
      logger.info(`OTP email sent to ${to} [messageId: ${info.messageId}]`);
    } catch (error) {
      logger.error(`Failed to send OTP email to ${to}: ${error.message}`);
      throw AppError.internal("Failed to send OTP email. Please try again later.", "MAIL_ERROR");
    }
  }
}

module.exports = new MailService();