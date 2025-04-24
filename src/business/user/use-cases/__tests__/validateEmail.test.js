const ValidateEmailUseCase = require('../validateEmail');

// Mock the user repository
const mockUserRepository = {
  findByEmailValidationToken: jest.fn(),
  update: jest.fn(),
};

describe('ValidateEmailUseCase', () => {
  let validateEmailUseCase;
  let mockUser;
  const validToken = 'valid-token';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create the use case with the mock repository
    validateEmailUseCase = new ValidateEmailUseCase(mockUserRepository);

    // Create a mock user with validation methods
    mockUser = {
      validateEmail: jest.fn(),
      publicData: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        emailValidated: true,
      },
    };
  });

  test('should throw error if token is not provided', async () => {
    await expect(validateEmailUseCase.execute()).rejects.toThrow('Validation token is required');
    await expect(validateEmailUseCase.execute(null)).rejects.toThrow(
      'Validation token is required'
    );
    await expect(validateEmailUseCase.execute('')).rejects.toThrow('Validation token is required');
  });

  test('should throw error if user is not found with token', async () => {
    // Setup repository to return null (user not found)
    mockUserRepository.findByEmailValidationToken.mockResolvedValue(null);

    await expect(validateEmailUseCase.execute(validToken)).rejects.toThrow(
      'Invalid or expired validation token'
    );
    expect(mockUserRepository.findByEmailValidationToken).toHaveBeenCalledWith(validToken);
  });

  test('should validate email successfully', async () => {
    // Setup repository to return a mock user
    mockUserRepository.findByEmailValidationToken.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);

    const result = await validateEmailUseCase.execute(validToken);

    // Verify the token was used to find the user
    expect(mockUserRepository.findByEmailValidationToken).toHaveBeenCalledWith(validToken);

    // Verify validateEmail was called on the user
    expect(mockUser.validateEmail).toHaveBeenCalled();

    // Verify the user was updated in the repository
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);

    // Verify the result is the user's public data
    expect(result).toEqual(mockUser.publicData);
  });

  test('should handle repository errors properly', async () => {
    // Setup repository to throw an error
    const errorMessage = 'Database connection error';
    mockUserRepository.findByEmailValidationToken.mockRejectedValue(new Error(errorMessage));

    await expect(validateEmailUseCase.execute(validToken)).rejects.toThrow(errorMessage);
  });
});
