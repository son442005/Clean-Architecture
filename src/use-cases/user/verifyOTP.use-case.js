const userRepository = require("../../repositories/user.repository.mongo");
const AppError = require("../../utils/AppError");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const verifyOTP = async ({ email, otp, newPassword }) => {
  const user = await userRepository.findByEmailWithSensitive(email);

  if (!user) throw AppError.badRequest("Invalid OTP or email.", "INVALID_OTP");

  const isValid = user.isOtpValid(otp);
  if (!isValid) {
    throw AppError.badRequest("OTP is invalid or has expired. Please request a new one.", "INVALID_OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await userRepository.updateById(user.id, {
    password: hashedPassword,
    otpCode: null,
    otpExpiresAt: null,
  });
};

module.exports = verifyOTP;