/**
 * Use case for retrieving all users details
 * @class
 */
class FindAllUsersUseCase {
  /**
   * Creates an instance of FindAllUsersUseCase
   * @param {Object} userRepository - The repository for user operations
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the get all users operation
   * @returns {Object} The users data
   */
  async execute() {
    const users = await this.userRepository.findAll();

    return users.map((us) => us.publicData);
  }
}

module.exports = FindAllUsersUseCase;
