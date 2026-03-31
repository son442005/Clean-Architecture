const userRepository = require("../../repositories/user.repository.mongo");
const mailService = require("../../services/mail.service");
const { generateOTP, getOtpExpiry } = require("../../utils/otp");
const logger = require("../../utils/logger");

const OTP_EXPIRES_IN_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10;

const forgotPasswordOTP = async (email) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    logger.info(`[ForgotPassword] Email not found, skipping OTP generation: ${email}`);
    return;
  }

  const otp = generateOTP(6);
  const otpExpiresAt = getOtpExpiry(OTP_EXPIRES_IN_MINUTES);

  await userRepository.updateById(user.id, { otpCode: otp, otpExpiresAt });

  await mailService.sendPasswordResetOtp({
    to: user.email,
    name: user.name,
    otp,
    expiresInMinutes: OTP_EXPIRES_IN_MINUTES,
  });

  logger.info(`[ForgotPassword] OTP sent to ${email}`);
};

module.exports = forgotPasswordOTP;