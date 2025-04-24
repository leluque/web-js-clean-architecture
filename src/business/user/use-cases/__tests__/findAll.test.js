const FindAllUsersUseCase = require('../findAll');

describe('FindAllUsersUseCase', () => {
  let mockUserRepository;
  let findAllUsersUseCase;
  let mockUsers;

  beforeEach(() => {
    // Create mock users
    mockUsers = [
      {
        id: '123',
        name: 'Test User 1',
        email: 'test1@example.com',
        publicData: { id: '123', name: 'Test User 1', email: 'test1@example.com' },
      },
      {
        id: '456',
        name: 'Test User 2',
        email: 'test2@example.com',
        publicData: { id: '456', name: 'Test User 2', email: 'test2@example.com' },
      },
    ];

    // Create a mock repository
    mockUserRepository = {
      findAll: jest.fn(),
    };

    // Initialize the use case with the mock repository
    findAllUsersUseCase = new FindAllUsersUseCase(mockUserRepository);
  });

  it('should return all users successfully', async () => {
    // Arrange
    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    // Act
    const result = await findAllUsersUseCase.execute();

    // Assert
    expect(mockUserRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers.map((user) => user.publicData));
    expect(result.length).toBe(2);
  });

  it('should return an empty array when no users exist', async () => {
    // Arrange
    mockUserRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await findAllUsersUseCase.execute();

    // Assert
    expect(mockUserRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('should handle errors from the repository', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockUserRepository.findAll.mockRejectedValue(error);

    // Act & Assert
    await expect(findAllUsersUseCase.execute()).rejects.toThrow('Database connection failed');
    expect(mockUserRepository.findAll).toHaveBeenCalled();
  });
});
