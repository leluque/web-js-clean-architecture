const createFastify = () => require('fastify')({ logger: true });
const path = require('path');
const { logger } = require('../../log');

const buildApp = async (fastify) => {
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
  const server = createFastify();
  await buildApp(server);
  let port = process.env.PORT || 0;
  try {
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on ${server.server.address().port}`);
  } catch (err) {
    logger.error('Error starting server:', err);
    server.log.error(err);
    process.exit(1);
  }
  return {
    server: server.server,
    stopServer: async () => {
      if (server && server.server) {
        try {
          await server.close();
          server.log.info('Server successfully stopped');
        } catch (err) {
          server.log.error('Error stopping server:', err);
          throw err;
        }
      }
    },
  };
};

module.exports = { startServer };
