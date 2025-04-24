const { NodeMailerEmailService } = require('../nodeMailerEmailService');
const nodemailer = require('nodemailer');

// Mock nodemailer
jest.mock('nodemailer');

describe('NodeMailerEmailService', () => {
  let originalEnv;
  let mockTransporter;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };

    // Setup environment variables for testing
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'password123';

    // Create mock transporter
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    };

    // Mock nodemailer.createTransport to return our mock
    nodemailer.createTransport.mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should initialize with correct configuration when secure is false', () => {
    // Act
    new NodeMailerEmailService();

    // Assert
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: '587',
      secure: false,
      auth: undefined,
    });
  });

  it('should initialize with correct configuration when secure is true', () => {
    // Arrange
    process.env.SMTP_SECURE = 'true';

    // Act
    new NodeMailerEmailService();

    // Assert
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: '587',
      secure: true,
      auth: {
        user: 'test@example.com',
        pass: 'password123',
      },
    });
  });

  it('should send email with correct parameters', async () => {
    // Arrange
    const emailService = new NodeMailerEmailService();
    const from = 'sender@example.com';
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const html = '<p>Test content</p>';

    // Act
    await emailService.sendEmail(from, to, subject, html);

    // Assert
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from,
      to,
      subject,
      html,
    });
  });

  it('should throw error when sendMail fails', async () => {
    // Arrange
    const emailService = new NodeMailerEmailService();
    const error = new Error('Failed to send email');
    mockTransporter.sendMail.mockRejectedValue(error);

    // Act & Assert
    await expect(
      emailService.sendEmail('sender@example.com', 'recipient@example.com', 'Subject', 'Content')
    ).rejects.toThrow('Failed to send email');
  });
});
