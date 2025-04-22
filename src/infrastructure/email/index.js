function getEmailService() {
  if (process.env.NODE_ENV === 'test') {
    const mock = jest.createMockFromModule('./emailService');
    mock.sendEmail = jest.fn();
    return mock;
  }
  const { NodeMailerEmailService } = require('./nodemailer/nodeMailerEmailService');
  return new NodeMailerEmailService();
}

module.exports = { getEmailService };
