const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn().mockReturnValue({ userId: 1, email: 'test@example.com' }),
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
