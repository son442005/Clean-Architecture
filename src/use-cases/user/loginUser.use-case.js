const userRepository = require("../../repositories/user.repository.mongo");
const AppError = require("../../utils/AppError");
const { signAccessToken, signRefreshToken } = require("../../utils/jwt");
const bcrypt = require("bcryptjs");

const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmailWithSensitive(email);

  const INVALID_CREDS_ERROR = AppError.unauthorized("Invalid email or password.", "INVALID_CREDENTIALS");

  if (!user) throw INVALID_CREDS_ERROR;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw INVALID_CREDS_ERROR;

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
};

module.exports = loginUser;