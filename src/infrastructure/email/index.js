function getEmailService() {
  if (process.env.NODE_ENV === 'test') {
    const mock = jest.createMockFromModule('../../business/shared/service/email/emailService');
    mock.sendEmail = jest.fn();
    return mock;
  }
  const { NodeMailerEmailService } = require('./nodemailer/nodeMailerEmailService');
  return new NodeMailerEmailService();

  // Other email service implementations can be added here.
}

module.exports = { getEmailService };
