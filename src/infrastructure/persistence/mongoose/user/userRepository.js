const { User } = require('@business/user/user');
const UserRepository = require('@business/user/userRepository');
const UserModel = require('@persistence/mongoose/user/userModel');

/**
 * @class MongooseUserRepository
 * @description MongoDB implementation of the UserRepository interface for user data persistence
 * @extends UserRepository
 */
class MongooseUserRepository extends UserRepository {
  /**
   * @constructor
   * @description Initializes a new instance of MongooseUserRepository
   */
  constructor() {
    super();
  }

  /**
   * @async
   * @method create
   * @description Creates a new user in the database
   * @param {Object} user - The user object to create
   * @returns {Promise<Object>} The created user with assigned ID
   */
  async create(user) {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.emailValidated,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailValidationToken: user.emailValidationToken,
      emailValidationTokenValidThru: user.emailValidationTokenValidThru,
      profileImage: user.profileImage,
    });

    const savedUser = await userDoc.save();
    return new User({
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      password: savedUser.password,
      emailValidated: savedUser.emailValidated,
      disabled: savedUser.disabled,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      emailValidationToken: savedUser.emailValidationToken,
      emailValidationTokenValidThru: savedUser.emailValidationTokenValidThru,
      profileImage: savedUser.profileImage,
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
    const user = await UserModel.findById(id);
    if (!user) return null;

    return new User({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.emailValidated,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailValidationToken: user.emailValidationToken,
      emailValidationTokenValidThru: user.emailValidationTokenValidThru,
      profileImage: user.profileImage,
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
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    return new User({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.emailValidated,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailValidationToken: user.emailValidationToken,
      emailValidationTokenValidThru: user.emailValidationTokenValidThru,
      profileImage: user.profileImage,
    });
  }

  /**
   * @async
   * @method findAll
   * @description Retrieves all users from the database
   * @returns {Promise<Array<Object>>} Array of user objects
   */
  async findAll() {
    const users = await UserModel.find({});
    return users.map(
      (user) =>
        new User({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          password: user.password,
          emailValidated: user.emailValidated,
          disabled: user.disabled,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          emailValidationToken: user.emailValidationToken,
          emailValidationTokenValidThru: user.emailValidationTokenValidThru,
          profileImage: user.profileImage,
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
    const user = await UserModel.findOne({ emailValidationToken: token });
    if (!user) return null;

    return new User({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.emailValidated,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailValidationToken: user.emailValidationToken,
      emailValidationTokenValidThru: user.emailValidationTokenValidThru,
      profileImage: user.profileImage,
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
    await UserModel.findByIdAndUpdate(user.id, {
      name: user.name,
      email: user.email,
      password: user.password,
      emailValidated: user.emailValidated,
      disabled: user.disabled,
      updatedAt: user.updatedAt,
      emailValidationToken: user.emailValidationToken,
      emailValidationTokenValidThru: user.emailValidationTokenValidThru,
      profileImage: user.profileImage,
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
    await UserModel.findByIdAndDelete(id);
  }
}

module.exports = MongooseUserRepository;
