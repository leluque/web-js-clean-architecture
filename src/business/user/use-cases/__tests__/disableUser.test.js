const DisableUserUseCase = require('../disableUser');
const { UserNotFoundError, UserDisabledError } = require('../../errors');

describe('DisableUserUseCase', () => {
  let mockUserRepository;
  let disableUserUseCase;
  let mockUser;

  beforeEach(() => {
    // Create a mock user
    mockUser = {
      id: '123',
      disabled: false,
      disable: jest.fn(),
      publicData: { id: '123', name: 'Test User', disabled: true },
    };

    // Create a mock repository
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    // Initialize the use case with the mock repository
    disableUserUseCase = new DisableUserUseCase(mockUserRepository);
  });

  it('should disable a user successfully', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue({
      ...mockUser,
      disabled: true,
    });

    // Act
    const result = await disableUserUseCase.execute('123');

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(mockUser.disable).toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser.publicData);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(disableUserUseCase.execute('456')).rejects.toThrow(UserNotFoundError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('456');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UserDisabledError when user is already disabled', async () => {
    // Arrange
    const disabledUser = {
      ...mockUser,
      disabled: true,
    };
    mockUserRepository.findById.mockResolvedValue(disabledUser);

    // Act & Assert
    await expect(disableUserUseCase.execute('123')).rejects.toThrow(UserDisabledError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });
});
