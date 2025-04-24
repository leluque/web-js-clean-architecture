const fastify = require('fastify')({ logger: true });
const path = require('path');

const buildApp = async () => {
  // Use plugin scope to ensure order
  fastify.register(async function (instance) {
    await instance.register(require('./middlewares/auth'));
    await instance.register(require('./middlewares/errorHandler'));
    await instance.register(require('./middlewares/uploadMiddleware'));
    await instance.register(require('./middlewares/requestWrapper'));

    await instance.register(require('./routers/userRouter'), { prefix: '/api/users' });

    // Static files (opcional)
    await instance.register(require('@fastify/static'), {
      root: path.join(__dirname, '../../../../uploads'),
      prefix: '/uploads/',
    });
  });

  return fastify;
};

const startServer = async () => {
  const app = await buildApp();
  let port = process.env.PORT || 3000;
  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
  return app;
};

const stopServer = async () => {
  if (fastify && fastify.server) {
    try {
      await fastify.close();
      fastify.log.info('Server successfully stopped');
    } catch (err) {
      fastify.log.error('Error stopping server:', err);
      throw err;
    }
  }
};

module.exports = { fastify, startServer, stopServer };
