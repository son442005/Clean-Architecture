const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Name is required"], trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String, required: [true, "Email is required"], unique: true,
      lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String, required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"], select: false,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otpCode: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) { next(err); }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    delete ret.otpCode;
    delete ret.otpExpiresAt;
    delete ret.refreshTokenHash;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);