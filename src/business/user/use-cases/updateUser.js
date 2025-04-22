const bcrypt = require('bcrypt');
const { User } = require('../user');
const {
  UserEmailNotValidatedError,
  UserDisabledError,
  UserNotFoundError,
  EmailAlreadyInUseError,
} = require('../errors');

/**
 * @class UpdateUserUseCase
 * @description Handles updating user information including name, email, password, and profile image
 */
class UpdateUserUseCase {
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
   * @description Updates user information based on provided data
   * @param {string|number} userId - ID of the user to update
   * @param {Object} updateData - Data to update
   * @param {string} [updateData.name] - User's new name
   * @param {string} [updateData.email] - User's new email address
   * @param {string} [updateData.password] - User's new password
   * @param {string} [updateData.profileImage] - Path to user's profile image
   * @returns {Promise<Object>} The updated user data
   * @throws {Error} When user is not found, account is disabled, or email is already in use
   */
  async execute(userId, { name, email, password, profileImage }) {
    // Find existing user
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new UserNotFoundError('User not found');
    }

    // Check if user is disabled
    if (existingUser.disabled) {
      throw new UserDisabledError('The user is disabled');
    }

    // Check if user has validated their email
    if (!existingUser.emailValidated) {
      throw new UserEmailNotValidatedError('The user e-mail has not been validated');
    }

    // Check email uniqueness if email is being updated
    if (email && email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(email);
      if (userWithEmail) {
        throw new EmailAlreadyInUseError('Email is already in use');
      }
    }

    // Hash password
    const saltRounds = 10;
    let hashedPassword;
    if (password) {
      if (password.trim().length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Update user properties
    const updateData = {
      ...existingUser.toJSON(),
      name: name || existingUser.name,
      email: email || existingUser.email,
      hashedPassword: hashedPassword || existingUser.password,
      profileImage: profileImage !== undefined ? profileImage : existingUser.profileImage,
      updatedAt: new Date(),
    };

    // Hash new password if provided
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Save changes
    const savedUser = await this.userRepository.update(
      new User({
        ...updateData,
      })
    );
    return savedUser.publicData;
  }
}

module.exports = UpdateUserUseCase;
