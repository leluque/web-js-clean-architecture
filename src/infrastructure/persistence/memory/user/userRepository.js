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
    this.users = {};
    this.autoIncrementId = 1;
  }

  async create(user) {
    const id = this.autoIncrementId++;
    user.id = id;
    user.createdAt = user.createdAt || new Date();
    user.updatedAt = user.updatedAt || new Date();
    this.users[id] = user.toJSON();
    return user;
  }

  async findById(id) {
    const user = this.users[Number(id)];
    return user ? user.toJSON() : null;
  }

  async findByEmail(email) {
    for (const id in this.users) {
      const user = this.users[id];
      if (user.email === email) {
        return user.toJSON();
      }
    }
    return null;
  }

  async findByEmailValidationToken(token) {
    for (const id in this.users) {
      const user = this.users[id];
      if (user.emailValidationToken === token) {
        return user.toJSON();
      }
    }
    return null;
  }

  async update(user) {
    if (!this.users[user.id]) {
      throw new Error('User not found');
    }
    user.updatedAt = new Date();
    this.users[user.id] = user.toJSON();
    return user;
  }

  async findAll() {
    return Object.values(this.users).map((user) => user.toJSON());
  }

  async delete(id) {
    this.users[Number(id)] = undefined;
  }
}

module.exports = InMemoryUserRepository;
