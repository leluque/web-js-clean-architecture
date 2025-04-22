const { UserNotFoundError, UserDisabledError } = require('../errors');

/**
 * Use case for disabling a user account
 * @class
 */
class DisableUserUseCase {
  /**
   * Creates an instance of DisableUserUseCase
   * @param {Object} userRepository - The repository for user operations
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the disable user operation
   * @param {string} userId - The ID of the user to disable
   * @returns {Object} The disabled user data
   * @throws {Error} When user is not found or already disabled
   */
  async execute(userId) {
    // Find existing user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(`User with id ${userId} not found`);
    }

    if (user.disabled) {
      throw new UserDisabledError(`User with id ${userId} is already disabled`);
    }

    // Disable user
    user.disable();

    // Save changes
    const savedUser = await this.userRepository.update(user);
    return savedUser.publicData;
  }
}

module.exports = DisableUserUseCase;
