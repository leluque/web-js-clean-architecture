const SignUpUseCase = require('../signUp');
const bcrypt = require('bcrypt');
const { User } = require('@business/user/user');
const { getEmailService } = require('@email');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('@business/user/user');
jest.mock('@email');

describe('SignUpUseCase', () => {
  let mockUserRepository;
  let signUpUseCase;
  let mockEmailService;
  let mockUser;

  beforeEach(() => {
    // Create mock user
    mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      emailValidated: false,
      disabled: false,
      requestEmailValidationToken: jest.fn().mockReturnValue('mock-validation-token'),
      publicData: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        emailValidated: false,
        disabled: false,
      },
    };

    // Create mock email service
    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
    };

    // Mock getEmailService to return our mock
    getEmailService.mockReturnValue(mockEmailService);

    // Create a mock repository
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Mock User constructor
    User.mockImplementation(() => mockUser);

    // Mock bcrypt hash
    bcrypt.hash.mockResolvedValue('hashedpassword123');

    // Initialize the use case with the mock repository
    signUpUseCase = new SignUpUseCase(mockUserRepository);

    // Mock environment variables
    process.env.APP_URL = 'http://localhost:3000';
    process.env.SMTP_FROM = 'test@example.com';
  });

  it('should register a new user successfully', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(mockUser);

    // Act
    const result = await signUpUseCase.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
    });
    expect(mockUser.requestEmailValidationToken).toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledWith(mockUser);
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'test@example.com',
      'Email validation',
      expect.stringContaining('mock-validation-token')
    );
    expect(result).toEqual(mockUser.publicData);
  });

  it('should throw error when user with email already exists', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    // Act & Assert
    await expect(
      signUpUseCase.execute({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('User with this email already exists');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when password is too short', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(
      signUpUseCase.execute({
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
      })
    ).rejects.toThrow('Password must be at least 8 characters long');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should handle errors from the repository', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockUserRepository.findByEmail.mockRejectedValue(error);

    // Act & Assert
    await expect(
      signUpUseCase.execute({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Database connection failed');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
