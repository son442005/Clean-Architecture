const userRepository = require("../repositories/user.repository.mongo");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/response");

const getMe = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    return sendSuccess(res, {
      message: "Profile retrieved successfully.",
      data: { user: user.toPublicJSON() },
    });
  } catch (err) { next(err); }
};

const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    const allowedUpdates = {};
    if (name !== undefined) allowedUpdates.name = name.trim();

    if (Object.keys(allowedUpdates).length === 0) {
      throw AppError.badRequest("No valid fields provided for update.", "NO_FIELDS");
    }

    const updated = await userRepository.updateById(req.user.id, allowedUpdates);
    if (!updated) throw AppError.notFound("User not found.", "USER_NOT_FOUND");

    return sendSuccess(res, {
      message: "Profile updated successfully.",
      data: { user: updated.toPublicJSON() },
    });
  } catch (err) { next(err); }
};

module.exports = { getMe, updateMe };