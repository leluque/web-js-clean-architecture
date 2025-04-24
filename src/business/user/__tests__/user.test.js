const { User } = require('../user');

describe('User', () => {
  describe('constructor', () => {
    it('should create a user with default values', () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
      });

      expect(user.id).toBeNull();
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedpassword123');
      expect(user.emailValidated).toBe(false);
      expect(user.disabled).toBe(false);
      expect(user.emailValidationToken).toBeNull();
      expect(user.emailValidationTokenValidThru).toBeNull();
      expect(user.profileImage).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with provided values', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      const validThru = new Date('2023-01-03');

      const user = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        emailValidated: true,
        disabled: true,
        createdAt,
        updatedAt,
        emailValidationToken: 'token123',
        emailValidationTokenValidThru: validThru,
        profileImage: '/path/to/image.jpg',
      });

      expect(user.id).toBe('123');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedpassword123');
      expect(user.emailValidated).toBe(true);
      expect(user.disabled).toBe(true);
      expect(user.emailValidationToken).toBe('token123');
      expect(user.emailValidationTokenValidThru).toBe(validThru);
      expect(user.profileImage).toBe('/path/to/image.jpg');
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid name', () => {
      expect(() => {
        new User({
          name: '',
          email: 'test@example.com',
          password: 'hashedpassword123',
        });
      }).toThrow('Name must be a string with at least 2 characters');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        new User({
          name: 'Test User',
          email: 'invalid-email',
          password: 'hashedpassword123',
        });
      }).toThrow('Invalid email format');
    });
  });

  describe('methods', () => {
    let user;

    beforeEach(() => {
      user = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        emailValidated: false,
        disabled: false,
      });
    });

    it('should validate email', () => {
      user.emailValidationToken = 'token123';
      user.emailValidationTokenValidThru = new Date();

      user.validateEmail();

      expect(user.emailValidated).toBe(true);
      expect(user.emailValidationToken).toBeNull();
      expect(user.emailValidationTokenValidThru).toBeNull();
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should disable user', () => {
      user.disable();

      expect(user.disabled).toBe(true);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should enable user', () => {
      user.disabled = true;
      user.enable();

      expect(user.disabled).toBe(false);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should request email validation token', () => {
      const token = user.requestEmailValidationToken();

      expect(token).toBe(user.emailValidationToken);
      expect(user.emailValidationToken).toHaveLength(32);
      expect(user.emailValidationTokenValidThru).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should check if email validation token is valid', () => {
      // Token is valid (future date)
      user.emailValidationToken = 'token123';
      user.emailValidationTokenValidThru = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(user.isEmailValidationTokenValid()).toBe(true);

      // Token is invalid (past date)
      user.emailValidationTokenValidThru = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(user.isEmailValidationTokenValid()).toBe(false);

      // No token
      user.emailValidationToken = null;
      expect(user.isEmailValidationTokenValid()).toBe(false);
    });
  });

  describe('toJSON and publicData', () => {
    it('should return full data with toJSON', () => {
      const user = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
      });

      const json = user.toJSON();

      expect(json).toHaveProperty('id', '123');
      expect(json).toHaveProperty('name', 'Test User');
      expect(json).toHaveProperty('email', 'test@example.com');
      expect(json).toHaveProperty('password', 'hashedpassword123');
      expect(json).toHaveProperty('emailValidated');
      expect(json).toHaveProperty('disabled');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
      expect(json).toHaveProperty('emailValidationToken');
      expect(json).toHaveProperty('emailValidationTokenValidThru');
      expect(json).toHaveProperty('profileImage');
    });

    it('should return public data without sensitive information', () => {
      const user = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
      });

      const publicData = user.publicData;

      expect(publicData).toHaveProperty('id', '123');
      expect(publicData).toHaveProperty('name', 'Test User');
      expect(publicData).toHaveProperty('email', 'test@example.com');
      expect(publicData).not.toHaveProperty('password');
      expect(publicData).toHaveProperty('emailValidated');
      expect(publicData).toHaveProperty('disabled');
      expect(publicData).toHaveProperty('createdAt');
      expect(publicData).toHaveProperty('updatedAt');
      expect(publicData).toHaveProperty('profileImage');
      expect(publicData).not.toHaveProperty('emailValidationToken');
      expect(publicData).not.toHaveProperty('emailValidationTokenValidThru');
    });
  });
});
