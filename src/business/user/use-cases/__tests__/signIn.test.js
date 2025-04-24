const SignInUseCase = require('../signIn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  UserDisabledError,
  InvalidCredentialsError,
  UserEmailNotValidatedError,
} = require('../../errors');

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('SignInUseCase', () => {
  let mockUserRepository;
  let signInUseCase;
  let mockUser;

  beforeEach(() => {
    // Create a mock user
    mockUser = {
      id: '123',
      email: 'test@example.com',
      password: 'hashedpassword123',
      emailValidated: true,
      disabled: false,
      toJSON: jest.fn().mockReturnValue({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        emailValidated: true,
        disabled: false,
      }),
    };

    // Create a mock repository
    mockUserRepository = {
      findByEmail: jest.fn(),
    };

    // Initialize the use case with the mock repository
    signInUseCase = new SignInUseCase(mockUserRepository);

    // Mock environment variable
    process.env.JWT_SECRET = 'test-secret';

    // Setup default mock implementations
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock-jwt-token');
  });

  it('should authenticate user and return token successfully', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    // Act
    const result = await signInUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: '123',
        email: 'test@example.com',
      },
      'test-secret',
      { expiresIn: '24h' }
    );
    expect(result).toEqual({
      token: 'mock-jwt-token',
      user: mockUser.toJSON(),
    });
  });

  it('should throw InvalidCredentialsError when user does not exist', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(
      signInUseCase.execute({ email: 'nonexistent@example.com', password: 'password123' })
    ).rejects.toThrow(InvalidCredentialsError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw UserDisabledError when user account is disabled', async () => {
    // Arrange
    const disabledUser = {
      ...mockUser,
      disabled: true,
    };
    mockUserRepository.findByEmail.mockResolvedValue(disabledUser);

    // Act & Assert
    await expect(
      signInUseCase.execute({ email: 'test@example.com', password: 'password123' })
    ).rejects.toThrow(UserDisabledError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw UserEmailNotValidatedError when email is not validated', async () => {
    // Arrange
    const notValidatedUser = {
      ...mockUser,
      emailValidated: false,
    };
    mockUserRepository.findByEmail.mockResolvedValue(notValidatedUser);

    // Act & Assert
    await expect(
      signInUseCase.execute({ email: 'test@example.com', password: 'password123' })
    ).rejects.toThrow(UserEmailNotValidatedError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsError when password is incorrect', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    // Act & Assert
    await expect(
      signInUseCase.execute({ email: 'test@example.com', password: 'wrongpassword' })
    ).rejects.toThrow(InvalidCredentialsError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123');
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
