const registerUser = require("../use-cases/user/registerUser.use-case");
const loginUser = require("../use-cases/user/loginUser.use-case");
const logout = require("../use-cases/user/logout.use-case");
const forgotPasswordOTP = require("../use-cases/user/forgotPasswordOTP.use-case");
const verifyOTP = require("../use-cases/user/verifyOTP.use-case");
const { attachTokensToCookies } = require("../utils/jwt");
const { sendSuccess, sendCreated } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await registerUser({ name, email, password });
    attachTokensToCookies(res, accessToken, refreshToken);
    return sendCreated(res, {
      message: "Registration successful.",
      data: { user: user.toPublicJSON(), accessToken },
    });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser({ email, password });
    attachTokensToCookies(res, accessToken, refreshToken);
    return sendSuccess(res, {
      message: "Login successful.",
      data: { user: user.toPublicJSON(), accessToken },
    });
  } catch (err) { next(err); }
};

const logoutUser = (req, res, next) => {
  try {
    logout(res);
    return sendSuccess(res, { message: "Logged out successfully." });
  } catch (err) { next(err); }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordOTP(email);
    return sendSuccess(res, {
      message: "If this email is registered, you will receive an OTP shortly.",
    });
  } catch (err) { next(err); }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await verifyOTP({ email, otp, newPassword });
    return sendSuccess(res, {
      message: "Password has been reset successfully. Please log in with your new password.",
    });
  } catch (err) { next(err); }
};

module.exports = { register, login, logoutUser, forgotPassword, verifyOtp };