/**
 * @class ValidateEmailUseCase
 * @description Handles the validation of a user's email address using a validation token
 */
class ValidateEmailUseCase {
  /**
   * @constructor
   * @param {Object} userRepository - Repository for user data operations
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @async
   * @method execute
   * @description Validates a user's email using the provided token
   * @param {string} token - The email validation token
   * @returns {Promise<Object>} The updated user data
   * @throws {Error} When token is missing, invalid, or expired
   */
  async execute(token) {
    if (!token) {
      throw new Error('Validation token is required');
    }

    // Find user by token
    const user = await this.userRepository.findByEmailValidationToken(token);
    if (!user) {
      throw new Error('Invalid or expired validation token');
    }

    // Mark email as validated
    user.validateEmail();

    // Save changes
    const savedUser = await this.userRepository.update(user);
    return savedUser.publicData;
  }
}

module.exports = ValidateEmailUseCase;
