class IUserRepository {
  async create(data) { throw new Error("IUserRepository.create() must be implemented."); }
  async findByEmail(email) { throw new Error("IUserRepository.findByEmail() must be implemented."); }
  async findById(id) { throw new Error("IUserRepository.findById() must be implemented."); }
  async updateById(id, updates) { throw new Error("IUserRepository.updateById() must be implemented."); }
  async findByEmailWithSensitive(email) { throw new Error("IUserRepository.findByEmailWithSensitive() must be implemented."); }
}

module.exports = IUserRepository;