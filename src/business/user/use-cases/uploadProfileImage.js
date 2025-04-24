const { UserNotFoundError, UserDisabledError } = require('../errors');

/**
 * @class UploadProfileImageUseCase
 * @description Handles uploading and updating a user's profile image
 */
class UploadProfileImageUseCase {
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
   * @description Updates a user's profile image with the provided image path
   * @param {string|number} userId - ID of the user to update
   * @param {string} imagePath - Path to the uploaded profile image
   * @returns {Promise<Object>} The updated user data
   * @throws {Error} When user is not found or account is disabled
   */
  async execute(userId, imagePath) {
    // Find existing user
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new UserNotFoundError('User not found');
    }

    if (existingUser.disabled) {
      throw new UserDisabledError('Account is disabled');
    }

    // Update user with profile image
    existingUser.profileImage = imagePath;
    existingUser.updatedAt = new Date();

    // Save changes
    const savedUser = await this.userRepository.update(existingUser);
    return savedUser.publicData;
  }
}

module.exports = UploadProfileImageUseCase;
