const { verifyAccessToken } = require("../utils/jwt");
const userRepository = require("../repositories/user.repository.mongo");
const AppError = require("../utils/AppError");

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) throw AppError.unauthorized("Authentication required. No token provided.", "NO_TOKEN");

    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) throw AppError.unauthorized("User no longer exists.", "USER_NOT_FOUND");

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return next(AppError.unauthorized("Not authenticated.", "NOT_AUTHENTICATED"));
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden(`Access denied. Required role(s): ${roles.join(", ")}.`, "INSUFFICIENT_ROLE"));
    }
    next();
  };
};

module.exports = { authenticate, authorize };