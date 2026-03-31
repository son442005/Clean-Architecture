const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, logoutUser, forgotPassword, verifyOtp } = require("../controllers/auth.controller");
const { registerValidation, loginValidation, forgotPasswordValidation, verifyOtpValidation } = require("../middlewares/validation.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again after 15 minutes.", code: "RATE_LIMIT_EXCEEDED" },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many password reset requests. Please try again in 1 hour.", code: "RATE_LIMIT_EXCEEDED" },
});

router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);
router.post("/logout", authenticate, logoutUser);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidation, forgotPassword);
router.post("/verify-otp", authLimiter, verifyOtpValidation, verifyOtp);

module.exports = router;