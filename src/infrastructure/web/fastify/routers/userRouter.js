const { UserController } = require('../../controller/userController');
const { handleController } = require('../../common/handleController');
const { getUserRepository } = require('@persistence');

async function userRoutes(fastify, opts) {
  const userController = new UserController(await getUserRepository());

  fastify.post('/signup', handleController(userController.signUp.bind(userController)));
  fastify.post('/signin', handleController(userController.signIn.bind(userController)));
  fastify.get('/', handleController(userController.findAll.bind(userController)));
  fastify.get(
    '/me',
    { preValidation: [fastify.authenticate] },
    handleController(userController.getUserDetails.bind(userController))
  );
  fastify.get(
    '/validate-email',
    handleController(userController.validateEmail.bind(userController))
  );
  fastify.put(
    '/me',
    { preValidation: [fastify.authenticate] },
    handleController(userController.updateUser.bind(userController))
  );
  fastify.delete(
    '/:id',
    { preValidation: [fastify.authenticate] },
    handleController(userController.disableUser.bind(userController))
  );
  fastify.post(
    '/me/profile-image',
    { preValidation: [fastify.authenticate], preHandler: fastify.upload.single('profileImage') },
    handleController(userController.uploadProfileImage.bind(userController))
  );
}

module.exports = userRoutes;
