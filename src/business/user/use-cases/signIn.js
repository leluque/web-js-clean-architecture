const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  UserDisabledError,
  InvalidCredentialsError,
  UserEmailNotValidatedError,
} = require('../errors');

/**
 * @class SignInUseCase
 * @description Handles user authentication and generates JWT tokens
 */
class SignInUseCase {
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
   * @description Authenticates a user with email and password, then generates a JWT token
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Object containing JWT token and user data
   * @throws {Error} When credentials are invalid or account is disabled
   */
  async execute({ email, password }) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError('Invalid email or password');
    }

    // Check if user is disabled
    if (user.disabled) {
      throw new UserDisabledError('The user is disabled');
    }

    // Check if user has validated their email
    if (!user.emailValidated) {
      throw new UserEmailNotValidatedError('The user e-mail has not been validated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: user.toJSON(),
    };
  }
}

module.exports = SignInUseCase;
