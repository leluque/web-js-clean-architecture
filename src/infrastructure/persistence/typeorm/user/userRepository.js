const { getRepository } = require('typeorm');
const { User } = require('@business/user/user');
const UserRepository = require('@business/user/userRepository');
const UserEntity = require('@persistence/typeorm/entities/User');

/**
 * @class TypeORMUserRepository
 * @description TypeORM implementation of the UserRepository interface for user data persistence
 * @extends UserRepository
 */
class TypeORMUserRepository extends UserRepository {
  /**
   * @constructor
   * @description Initializes a new instance of TypeORMUserRepository
   */
  constructor() {
    super();
    // Connection is managed by the TypeORM connection module
  }

  /**
   * @async
   * @method create
   * @description Creates a new user in the database
   * @param {Object} user - The user object to create
   * @returns {Promise<Object>} The created user with assigned ID
   */
  async create(user) {
    const userRepository = getRepository(UserEntity);

    const userEntity = userRepository.create({
      name: user.name,
      email: user.email,
      password: user.password,
      email_validated: user.emailValidated,
      disabled: user.disabled,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      email_validation_token: user.emailValidationToken,
      email_validation_token_valid_thru: user.emailValidationTokenValidThru,
      profile_image: user.profileImage,
    });

    const savedUser = await userRepository.save(userEntity);

    return new User({
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      password: savedUser.password,
      emailValidated: savedUser.email_validated,
      disabled: savedUser.disabled,
      createdAt: savedUser.created_at,
      updatedAt: savedUser.updated_at,
      emailValidationToken: savedUser.email_validation_token,
      emailValidationTokenValidThru: savedUser.email_validation_token_valid_thru,
      profileImage: savedUser.profile_image,
    });
  }

  /**
   * @async
   * @method findById
   * @description Finds a user by their ID
   * @param {string|number} id - The ID of the user to find
   * @returns {Promise<Object|null>} The found user or null if not found
   */
  async findById(id) {
    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { id } });
    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.email_validated,
      disabled: user.disabled,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      emailValidationToken: user.email_validation_token,
      emailValidationTokenValidThru: user.email_validation_token_valid_thru,
      profileImage: user.profile_image,
    });
  }

  /**
   * @async
   * @method findByEmail
   * @description Finds a user by their email address
   * @param {string} email - The email address to search for
   * @returns {Promise<Object|null>} The found user or null if not found
   */
  async findByEmail(email) {
    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.email_validated,
      disabled: user.disabled,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      emailValidationToken: user.email_validation_token,
      emailValidationTokenValidThru: user.email_validation_token_valid_thru,
      profileImage: user.profile_image,
    });
  }

  /**
   * @async
   * @method update
   * @description Updates an existing user in the database
   * @param {Object} user - The user object with updated properties
   * @returns {Promise<Object>} The updated user object
   */
  async update(user) {
    const userRepository = getRepository(UserEntity);

    await userRepository.update(user.id, {
      name: user.name,
      email: user.email,
      password: user.password,
      email_validated: user.emailValidated,
      disabled: user.disabled,
      updated_at: user.updatedAt,
      email_validation_token: user.emailValidationToken,
      email_validation_token_valid_thru: user.emailValidationTokenValidThru,
      profile_image: user.profileImage,
    });

    return user;
  }

  /**
   * @async
   * @method delete
   * @description Deletes a user from the database by their ID
   * @param {string|number} id - The ID of the user to delete
   * @returns {Promise<void>}
   */
  async delete(id) {
    const userRepository = getRepository(UserEntity);
    await userRepository.delete(id);
  }

  /**
   * @async
   * @method findAll
   * @description Retrieves all users from the database
   * @returns {Promise<Array<Object>>} Array of user objects
   */
  async findAll() {
    const userRepository = getRepository(UserEntity);
    const users = await userRepository.find();

    return users.map(
      (user) =>
        new User({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          emailValidated: user.email_validated,
          disabled: user.disabled,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          emailValidationToken: user.email_validation_token,
          emailValidationTokenValidThru: user.email_validation_token_valid_thru,
          profileImage: user.profile_image,
        })
    );
  }

  /**
   * @async
   * @method findByEmailValidationToken
   * @description Finds a user by their email validation token
   * @param {string} token - The email validation token to search for
   * @returns {Promise<Object|null>} The found user or null if not found
   */
  async findByEmailValidationToken(token) {
    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({
      where: { email_validation_token: token },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.email_validated,
      disabled: user.disabled,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      emailValidationToken: user.email_validation_token,
      emailValidationTokenValidThru: user.email_validation_token_valid_thru,
      profileImage: user.profile_image,
    });
  }
}

module.exports = TypeORMUserRepository;
