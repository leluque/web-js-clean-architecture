/**
 * Use case for retrieving user details
 * @class
 */
class GetUserDetailsUseCase {
  /**
   * Creates an instance of GetUserDetailsUseCase
   * @param {Object} userRepository - The repository for user operations
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the get user details operation
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Object} The user data
   * @throws {Error} When user is not found or account is disabled
   */
  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.disabled) {
      throw new Error('Account is disabled');
    }

    return user.publicData;
  }
}

module.exports = GetUserDetailsUseCase;
