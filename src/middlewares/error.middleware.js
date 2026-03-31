const logger = require("../utils/logger");
const { sendError } = require("../utils/response");
const AppError = require("../utils/AppError");

const normalizeError = (err) => {
  if (err.isOperational) return err;

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return AppError.badRequest(messages.join(". "), "VALIDATION_ERROR");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue?.[field];
    return AppError.conflict(`${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already in use.`, "DUPLICATE_KEY");
  }

  if (err.name === "CastError") {
    return AppError.badRequest(`Invalid value for field: ${err.path}`, "CAST_ERROR");
  }

  if (err.name === "JsonWebTokenError") return AppError.unauthorized("Invalid token.", "TOKEN_INVALID");
  if (err.name === "TokenExpiredError") return AppError.unauthorized("Token has expired.", "TOKEN_EXPIRED");

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return AppError.badRequest("Malformed JSON in request body.", "MALFORMED_JSON");
  }

  logger.error("Unhandled non-operational error:", err);
  return AppError.internal();
};

const notFoundHandler = (req, res, next) => {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  const normalized = normalizeError(err);

  if (normalized.isOperational) {
    logger.warn(`[${req.method}] ${req.path} → ${normalized.statusCode} ${normalized.code || ""}: ${normalized.message}`);
  } else {
    logger.error(`Unexpected error on [${req.method}] ${req.path}:`, err);
  }

  return sendError(res, {
    statusCode: normalized.statusCode,
    message: normalized.message,
    code: normalized.code,
  });
};

module.exports = { notFoundHandler, globalErrorHandler };