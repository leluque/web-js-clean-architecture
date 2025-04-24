const UploadProfileImageUseCase = require('../uploadProfileImage');
const { UserNotFoundError } = require('../../errors');
const fs = require('fs');
const path = require('path');

// Mock fs module
jest.mock('fs');
jest.mock('path');

describe('UploadProfileImageUseCase', () => {
  let mockUserRepository;
  let uploadProfileImageUseCase;
  let mockUser;
  let mockFile;

  beforeEach(() => {
    // Create a mock user
    mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      profileImage: null,
      publicData: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        profileImage: null,
      },
    };
    mockUser.toJSON = jest.fn().mockReturnValue(mockUser);

    // Create a mock file
    mockFile = {
      fieldname: 'profileImage',
      originalname: 'test-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image content'),
      size: 1024,
    };

    // Create a mock repository
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    // Mock path.join to return a predictable path
    path.join.mockImplementation((...args) => args.join('/'));

    // Mock fs.existsSync to return false (directory doesn't exist)
    fs.existsSync.mockReturnValue(false);

    // Mock fs.mkdirSync
    fs.mkdirSync.mockImplementation(() => {});

    // Mock fs.writeFileSync
    fs.writeFileSync.mockImplementation(() => {});

    // Initialize the use case with the mock repository
    uploadProfileImageUseCase = new UploadProfileImageUseCase(mockUserRepository);
  });

  it('should upload profile image successfully', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUser);
    const updatedUser = {
      ...mockUser,
      profileImage: '/uploads/users/123/profile-image.jpg',
      publicData: {
        ...mockUser.publicData,
        profileImage: '/uploads/users/123/profile-image.jpg',
      },
    };
    mockUserRepository.update.mockResolvedValue(updatedUser);

    // Act
    const result = await uploadProfileImageUseCase.execute('123', mockFile);

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(result).toEqual(updatedUser.publicData);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(uploadProfileImageUseCase.execute('456', mockFile)).rejects.toThrow(
      UserNotFoundError
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('456');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should handle errors from the repository', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockUserRepository.findById.mockRejectedValue(error);

    // Act & Assert
    await expect(uploadProfileImageUseCase.execute('123', mockFile)).rejects.toThrow(
      'Database connection failed'
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
  });
});
