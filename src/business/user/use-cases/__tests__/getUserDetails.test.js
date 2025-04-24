const GetUserDetailsUseCase = require('../getUserDetails');
const { UserNotFoundError } = require('../../errors');

describe('GetUserDetailsUseCase', () => {
  let mockUserRepository;
  let getUserDetailsUseCase;
  let mockUser;

  beforeEach(() => {
    // Create a mock user
    mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      publicData: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        emailValidated: true,
        disabled: false,
      },
    };

    // Create a mock repository
    mockUserRepository = {
      findById: jest.fn(),
    };

    // Initialize the use case with the mock repository
    getUserDetailsUseCase = new GetUserDetailsUseCase(mockUserRepository);
  });

  it('should return user details successfully', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUser);

    // Act
    const result = await getUserDetailsUseCase.execute('123');

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockUser.publicData);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getUserDetailsUseCase.execute('456')).rejects.toThrow(UserNotFoundError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('456');
  });

  it('should handle errors from the repository', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockUserRepository.findById.mockRejectedValue(error);

    // Act & Assert
    await expect(getUserDetailsUseCase.execute('123')).rejects.toThrow(
      'Database connection failed'
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
  });
});
