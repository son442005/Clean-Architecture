const IUserRepository = require("./user.repository.interface");
const UserModel = require("../models/user.model");
const UserEntity = require("../entities/user.entity");

const toEntity = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ virtuals: true }) : doc;
  return new UserEntity({
    id: obj._id?.toString() || obj.id,
    name: obj.name, email: obj.email, password: obj.password,
    isVerified: obj.isVerified, role: obj.role,
    otpCode: obj.otpCode, otpExpiresAt: obj.otpExpiresAt,
    createdAt: obj.createdAt, updatedAt: obj.updatedAt,
  });
};

class UserRepositoryMongo extends IUserRepository {
  async create(data) {
    const user = await UserModel.create(data);
    return toEntity(user);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
    return user ? toEntity(user) : null;
  }

  async findByEmailWithSensitive(email) {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
      .select("+password +otpCode +otpExpiresAt +refreshTokenHash").lean();
    return user ? toEntity(user) : null;
  }

  async findById(id) {
    const user = await UserModel.findById(id).lean();
    return user ? toEntity(user) : null;
  }

  async findByIdWithSensitive(id) {
    const user = await UserModel.findById(id)
      .select("+password +otpCode +otpExpiresAt +refreshTokenHash").lean();
    return user ? toEntity(user) : null;
  }

  async updateById(id, updates) {
    const user = await UserModel.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })
      .select("+otpCode +otpExpiresAt").lean();
    return user ? toEntity(user) : null;
  }

  async existsByEmail(email) {
    const count = await UserModel.countDocuments({ email: email.toLowerCase().trim() });
    return count > 0;
  }
}

module.exports = new UserRepositoryMongo();