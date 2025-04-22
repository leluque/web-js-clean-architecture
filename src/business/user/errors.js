class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class UserDisabledError extends UserError {
  constructor(message) {
    super(message || 'Account is disabled');
    this.statusCode = 403;
  }
}

class InvalidCredentialsError extends UserError {
  constructor(message) {
    super(message || 'Invalid credentials');
    this.statusCode = 401;
  }
}

class UserEmailNotValidatedError extends UserError {
  constructor(message) {
    super(message || 'E-mail not validated');
    this.statusCode = 403;
  }
}

class UserNotFoundError extends UserError {
  constructor(message) {
    super(message || 'Not found');
    this.statusCode = 404;
  }
}

class EmailAlreadyInUseError extends UserError {
  constructor(message) {
    super(message || 'Email already in use');
    this.statusCode = 400;
  }
}

module.exports = {
  UserError,
  UserDisabledError,
  InvalidCredentialsError,
  UserEmailNotValidatedError,
  UserNotFoundError,
  EmailAlreadyInUseError,
};
