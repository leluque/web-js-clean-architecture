const bcrypt = require('bcrypt');
const { User } = require('@business/user/user');
const { getEmailService } = require('@email');
const { logger } = require('../../../infrastructure/log');

/**
 * @class SignUpUseCase
 * @description Handles user registration, password hashing, and email validation
 */
class SignUpUseCase {
  /**
   * @constructor
   * @param {Object} userRepository - Repository for user data operations
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.emailService = getEmailService();
  }

  /**
   * @async
   * @method execute
   * @description Registers a new user, hashes password, and sends validation email
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} The created user data
   * @throws {Error} When user with email already exists
   */
  async execute({ name, email, password }) {
    logger.info('Sign up use case started for user', { name, email });
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    let hashedPassword;
    if (!password || password.trim().length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Generate validation token
    const validationToken = user.requestEmailValidationToken();

    // Save user
    const savedUser = await this.userRepository.create(user);

    // Send validation email
    const validationUrl = `${process.env.APP_URL}/api/users/validate-email?token=${validationToken}`;
    const emailContent = `
        <h1>Email Validation</h1>
        <p>Please click the link below to validate your email address:</p>
        <a href="${validationUrl}">${validationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `;
    await this.emailService.sendEmail(
      process.env.SMTP_FROM,
      user.email,
      'Email validation',
      emailContent
    );

    if (!savedUser) {
      throw new Error('User creation failed');
    }
    return savedUser.publicData;
  }
}

module.exports = SignUpUseCase;
