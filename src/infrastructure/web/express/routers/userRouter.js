const express = require('express');
const { UserController } = require('../../controller/userController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');
const { handleController } = require('../../common/handleController');
const { getUserRepository } = require('@persistence');

async function configureUserRouter() {
  const router = express.Router();

  const userController = new UserController(await getUserRepository());

  // Sign up
  router.post('/signup', handleController(userController.signUp.bind(userController)));

  // Sign in
  router.post('/signin', handleController(userController.signIn.bind(userController)));

  // Get all users
  router.get('/', handleController(userController.findAll.bind(userController)));

  // Get user details (protected route)
  router.get(
    '/me',
    authMiddleware,
    handleController(userController.getUserDetails.bind(userController))
  );

  // Email validation endpoint
  router.get(
    '/validate-email',
    handleController(userController.validateEmail.bind(userController))
  );

  // Update user (protected route)
  router.put(
    '/me',
    authMiddleware,
    handleController(userController.updateUser.bind(userController))
  );

  // Disable user (protected route)
  router.post(
    '/disable/:id',
    authMiddleware,
    handleController(userController.disableUser.bind(userController))
  );

  // Upload profile image (protected route)
  router.post(
    '/me/profile-image',
    authMiddleware,
    upload.single('profileImage'),
    handleController(userController.uploadProfileImage.bind(userController))
  );

  return router;
}

module.exports = configureUserRouter;
