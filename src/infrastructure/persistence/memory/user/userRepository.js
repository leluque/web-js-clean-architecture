const { User } = require('@business/user/user');
const UserRepository = require('@business/user/userRepository');

/**
 * @class InMemoryUserRepository
 * @description In-memory implementation of the UserRepository interface
 * @extends UserRepository
 */
class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map();
    this.autoIncrementId = 1;
  }

  async create(user) {
    const id = this.autoIncrementId++;
    user.id = id;
    user.createdAt = user.createdAt || new Date();
    user.updatedAt = user.updatedAt || new Date();
    this.users.set(id, { ...user });
    return user;
  }

  async findById(id) {
    const user = this.users.get(Number(id));
    return user ? new User({ ...user }) : null;
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return new User({ ...user });
      }
    }
    return null;
  }

  async findByEmailValidationToken(token) {
    for (const user of this.users.values()) {
      if (user.emailValidationToken === token) {
        return new User({ ...user });
      }
    }
    return null;
  }

  async update(user) {
    if (!this.users.has(user.id)) {
      throw new Error('User not found');
    }
    user.updatedAt = new Date();
    this.users.set(user.id, { ...user });
    return user;
  }

  async findAll() {
    return Array.from(this.users.values()).map((user) => new User({ ...user }));
  }

  async delete(id) {
    this.users.delete(Number(id));
  }
}

module.exports = InMemoryUserRepository;
