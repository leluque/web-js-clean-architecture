const fp = require('fastify-plugin');

async function authPlugin(fastify, opts) {
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
      request.headers.loggedUser = request.user;
    } catch (err) {
      fastify.log.warn({ err }, 'JWT verification failed');
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}

module.exports = fp(authPlugin);
