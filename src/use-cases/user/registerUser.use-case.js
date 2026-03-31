const userRepository = require("../../repositories/user.repository.mongo");
const AppError = require("../../utils/AppError");
const { signAccessToken, signRefreshToken } = require("../../utils/jwt");

const registerUser = async ({ name, email, password }) => {
  const exists = await userRepository.existsByEmail(email);
  if (exists) throw AppError.conflict("Email is already registered.", "EMAIL_EXISTS");

  const user = await userRepository.create({ name, email, password });

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
};

module.exports = registerUser;