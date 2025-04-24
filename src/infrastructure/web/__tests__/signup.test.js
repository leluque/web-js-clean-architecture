const request = require('supertest');
const InMemoryUserRepository = require('../../persistence/memory/user/userRepository');
const { getUserRepository } = require('../../persistence/index');

jest.mock('../../persistence/index');

describe('Signup Endpoint', () => {
  // Test both Express and Fastify servers
  const webFrameworks = ['express', 'fastify'];

  webFrameworks.forEach((webFramework) => {
    let server;
    let userRepository;
    let stopServer;

    describe(`with ${webFramework} server`, () => {
      beforeAll(async () => {
        const { startServer } = require(`../${webFramework}/app`);

        // Initialize a fresh user repository for each test
        userRepository = new InMemoryUserRepository();
        getUserRepository.mockResolvedValue(userRepository);

        // Start the server
        ({ server, stopServer } = await startServer());
      });

      afterAll(async () => {
        // Stop the server after each test
        await stopServer();
      });

      test('should create a new user with valid data', async () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        };

        const response = await request(server).post('/api/users/signup').send(userData).expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(userData.name);
        expect(response.body.email).toBe(userData.email);
        expect(response.body).not.toHaveProperty('password');
        expect(response.body.emailValidated).toBe(false);

        // Verify user was actually created in repository
        const createdUser = await userRepository.findByEmail(userData.email);
        expect(createdUser).not.toBeNull();
        expect(createdUser.name).toBe(userData.name);
      });

      test('should return 400 when trying to signup with an email that already exists', async () => {
        const userData = {
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'hashedpassword123',
        };

        await request(server).post('/api/users/signup').send(userData).expect(201);
        const response = await request(server).post('/api/users/signup').send(userData).expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('already exists');
      });

      test('should return 400 when trying to signup without name', async () => {
        const userData = {
          email: 'noname@example.com',
          password: 'password123',
        };

        const response = await request(server).post('/api/users/signup').send(userData).expect(400);

        expect(response.body).toHaveProperty('error');
      });

      test('should return 400 when trying to signup without email', async () => {
        const userData = {
          name: 'No Email User',
          password: 'password123',
        };

        const response = await request(server).post('/api/users/signup').send(userData).expect(400);

        expect(response.body).toHaveProperty('error');
      });

      test('should return 400 when trying to signup without password', async () => {
        const userData = {
          name: 'No Password User',
          email: 'nopassword@example.com',
        };

        const response = await request(server).post('/api/users/signup').send(userData).expect(400);

        expect(response.body).toHaveProperty('error');
      });

      test('should return 400 when trying to signup with invalid email format', async () => {
        const userData = {
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'password123',
        };

        const response = await request(server).post('/api/users/signup').send(userData).expect(400);

        expect(response.body).toHaveProperty('error');
      });

      test('should return 400 when trying to signup with password less than 8 characters', async () => {
        const userData = {
          name: 'Short Password User',
          email: 'shortpass@example.com',
          password: 'short',
        };

        const response = await request(server).post('/api/users/signup').send(userData).expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Password must be at least 8 characters long');
      });
    });
  });
});
