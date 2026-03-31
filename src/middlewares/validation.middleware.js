const { validationResult, body } = require("express-validator");
const { sendError } = require("../utils/response");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, {
      statusCode: 422,
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required.")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters."),
  body("email").trim().notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email format.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number."),
  validate,
];

const loginValidation = [
  body("email").trim().notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email format.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
  validate,
];

const forgotPasswordValidation = [
  body("email").trim().notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email format.").normalizeEmail(),
  validate,
];

const verifyOtpValidation = [
  body("email").trim().notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email format.").normalizeEmail(),
  body("otp").trim().notEmpty().withMessage("OTP code is required.")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits.")
    .isNumeric().withMessage("OTP must contain only digits."),
  body("newPassword").notEmpty().withMessage("New password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number."),
  validate,
];

module.exports = { validate, registerValidation, loginValidation, forgotPasswordValidation, verifyOtpValidation };