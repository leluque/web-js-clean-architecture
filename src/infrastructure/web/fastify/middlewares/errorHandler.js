// Fastify error handler middleware
module.exports = async function (fastify, opts) {
  fastify.setErrorHandler(function (error, request, reply) {
    // Customize error response as needed
    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      error: error.message || 'Internal Server Error',
      statusCode,
    });
  });
};
