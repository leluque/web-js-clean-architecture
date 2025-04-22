const SignUpUseCase = require('@business/user/use-cases/signUp');
const SignInUseCase = require('@business/user/use-cases/signIn');
const GetUserDetailsUseCase = require('@business/user/use-cases/getUserDetails');
const UpdateUserUseCase = require('@business/user/use-cases/updateUser');
const DisableUserUseCase = require('@business/user/use-cases/disableUser');
const ValidateEmailUseCase = require('@business/user/use-cases/validateEmail');
const UploadProfileImageUseCase = require('@business/user/use-cases/uploadProfileImage');
const FindAllUsersUseCase = require('@business/user/use-cases/findAll');
const {
  UserDisabledError,
  InvalidCredentialsError,
  UserEmailNotValidatedError,
} = require('@business/user/errors');
const { logger } = require('../../log');
const { UserNotFoundError } = require('../../../business/user/errors');

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signUp(req) {
    logger.info('SignUp request received');
    try {
      const signUpUseCase = new SignUpUseCase(this.userRepository);
      const user = await signUpUseCase.execute(req.body);
      return { statusCode: 201, payload: user };
    } catch (error) {
      logger.error('Error in signUp:', { errorMsg: error.message, errorStk: error.stack });
      return { statusCode: 400, payload: { error: error.message } };
    }
  }

  async signIn(req) {
    try {
      const signInUseCase = new SignInUseCase(this.userRepository);
      const result = await signInUseCase.execute(req.body);
      return { statusCode: 200, payload: result };
    } catch (error) {
      logger.error('Error in signIn:', { errorMsg: error.message, errorStk: error.stack });
      let statusCode = 400;
      if (
        error instanceof UserDisabledError ||
        error instanceof InvalidCredentialsError ||
        error instanceof UserEmailNotValidatedError
      ) {
        statusCode = 403;
      }
      return {
        statusCode,
        payload: { errorMessage: error.message },
      };
    }
  }

  async findAll() {
    try {
      const findAll = new FindAllUsersUseCase(this.userRepository);
      const users = await findAll.execute();
      return { statusCode: 200, payload: users };
    } catch (error) {
      logger.error('Error in findAll:', { errorMsg: error.message, errorStk: error.stack });
      return { statusCode: 400, errorMessage: error.message };
    }
  }

  async getUserDetails(req) {
    try {
      const getUserDetailsUseCase = new GetUserDetailsUseCase(this.userRepository);
      const user = await getUserDetailsUseCase.execute(req.headers.loggedUser.userId);
      return { statusCode: 200, payload: user };
    } catch (error) {
      logger.error('Error in getUserDetails:', { errorMsg: error.message, errorStk: error.stack });
      return { statusCode: 400, errorMessage: error.message };
    }
  }

  async validateEmail(req) {
    try {
      const validateEmailUseCase = new ValidateEmailUseCase(this.userRepository);
      const user = await validateEmailUseCase.execute(req.query.token);
      return {
        statusCode: 200,
        payload: { message: 'Email validated successfully', user },
      };
    } catch (error) {
      logger.error('Error in validateEmail:', { errorMsg: error.message, errorStk: error.stack });
      return { statusCode: 400, errorMessage: error.message };
    }
  }

  async updateUser(req) {
    try {
      const updateUserUseCase = new UpdateUserUseCase(this.userRepository);
      const user = await updateUserUseCase.execute(req.headers.loggedUser.userId, req.body);
      return { statusCode: 200, payload: user };
    } catch (error) {
      logger.error('Error in updateUser:', { errorMsg: error.message, errorStk: error.stack });
      if (error instanceof UserNotFoundError) {
        return { statusCode: 404, errorMessage: error.message };
      }
      return { statusCode: 400, errorMessage: error.message };
    }
  }

  async disableUser(req) {
    try {
      logger.debug(`Original req: ${req?.originalRequest?.params}`);
      const disableUserUseCase = new DisableUserUseCase(this.userRepository);
      const user = await disableUserUseCase.execute(req.params.id);
      return { statusCode: 200, payload: user };
    } catch (error) {
      logger.error('Error in disableUser:', { errorMsg: error.message, errorStk: error.stack });
      return { statusCode: 400, errorMessage: error.message };
    }
  }

  async uploadProfileImage(req) {
    try {
      if (!req.file) {
        return { statusCode: 400, error: { error: 'No file uploaded' } };
      }
      const imagePath = `/uploads/${req.file.filename}`;
      const uploadProfileImageUseCase = new UploadProfileImageUseCase(this.userRepository);
      const user = await uploadProfileImageUseCase.execute(
        req.headers.loggedUser.userId,
        imagePath
      );
      return { statusCode: 200, payload: user };
    } catch (error) {
      logger.error('Error in uploadProfileImage:', {
        errorMsg: error.message,
        errorStk: error.stack,
      });
      return { statusCode: 400, errorMessage: error.message };
    }
  }
}

module.exports = { UserController };
