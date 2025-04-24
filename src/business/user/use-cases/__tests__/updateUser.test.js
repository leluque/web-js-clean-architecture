const UpdateUserUseCase = require('../updateUser');
const { UserNotFoundError } = require('../../errors');

describe('UpdateUserUseCase', () => {
  let mockUserRepository;
  let updateUserUseCase;
  let mockUser;

  beforeEach(() => {
    // Create a mock user
    mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      disabled: false,
      publicData: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        disabled: false,
      },
      emailValidated: true,
    };
    mockUser.toJSON = jest.fn().mockReturnValue(mockUser);

    // Create a mock repository
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    // Initialize the use case with the mock repository
    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  it('should update user successfully', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue({
      ...mockUser,
      name: 'Updated User',
      publicData: {
        ...mockUser.publicData,
        name: 'Updated User',
      },
    });

    // Act
    const result = await updateUserUseCase.execute('123', { name: 'Updated User' });

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '123',
        name: 'Updated User',
      })
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: '123',
        name: 'Updated User',
      })
    );
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateUserUseCase.execute('456', { name: 'Updated User' })).rejects.toThrow(
      UserNotFoundError
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('456');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should handle validation errors', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUser);
    const validationError = new Error('Name must be a string with at least 2 characters');
    mockUserRepository.update.mockRejectedValue(validationError);

    // Act & Assert
    await expect(updateUserUseCase.execute('123', { name: 'A' })).rejects.toThrow(
      'Name must be a string with at least 2 characters'
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should handle errors from the repository', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockUserRepository.findById.mockRejectedValue(error);

    // Act & Assert
    await expect(updateUserUseCase.execute('123', { name: 'Updated User' })).rejects.toThrow(
      'Database connection failed'
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
  });
});
