const nodemailer = require('nodemailer');
const { EmailService } = require('../emailService');

class NodeMailerEmailService extends EmailService {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_SECURE === 'true'
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  async sendEmail(from, to, subject, html) {
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = { NodeMailerEmailService };
