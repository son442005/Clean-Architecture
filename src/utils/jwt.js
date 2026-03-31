const jwt = require("jsonwebtoken");
const AppError = require("./AppError");

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } = process.env;

const signAccessToken = (payload) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined.");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || "7d" });
};

const signRefreshToken = (payload) => {
  if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined.");
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN || "30d" });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw AppError.unauthorized("Access token has expired.", "TOKEN_EXPIRED");
    throw AppError.unauthorized("Invalid access token.", "TOKEN_INVALID");
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw AppError.unauthorized("Refresh token has expired.", "REFRESH_TOKEN_EXPIRED");
    throw AppError.unauthorized("Invalid refresh token.", "REFRESH_TOKEN_INVALID");
  }
};

const attachTokensToCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true, secure: isProd, sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, secure: isProd, sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, attachTokensToCookies, clearAuthCookies };