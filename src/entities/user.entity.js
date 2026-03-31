class UserEntity {
  constructor({ id, name, email, password, isVerified = false, role = "user", otpCode = null, otpExpiresAt = null, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email?.toLowerCase().trim();
    this.password = password;
    this.isVerified = isVerified;
    this.role = role;
    this.otpCode = otpCode;
    this.otpExpiresAt = otpExpiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isOtpValid(code) {
    if (!this.otpCode || !this.otpExpiresAt) return false;
    if (this.otpCode !== code) return false;
    return new Date() < new Date(this.otpExpiresAt);
  }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isVerified: this.isVerified,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

module.exports = UserEntity;