// fastify/middlewares/requestWrapper.js
const fp = require('fastify-plugin');
const { RequestWrapper } = require('../../common/requestWrapper');
const { ResponseWrapper } = require('../../common/responseWrapper');

module.exports = fp(
  async function (fastify, opts) {
    fastify.addHook('preHandler', async (req, reply) => {
      const requestData = {
        originalRequest: req,
        getRequestData: (originalRequest) => ({
          headers: originalRequest.headers || {},
          params: originalRequest.params || {},
          query: originalRequest.query || {},
          originalUrl: originalRequest.url,
          method: originalRequest.method,
          protocol: originalRequest.protocol,
          ip: originalRequest.ip,
          body: originalRequest.body || {},
          user: originalRequest.user || null,
          file: originalRequest.file || null,
          files: originalRequest.files || [],
        }),
      };

      req.wrappedRequest = new RequestWrapper(requestData);
      req.responseWrapper = new ResponseWrapper((payload, statusCode) => {
        reply.code(statusCode).send(payload);
      });
    });
  },
  { encapsulate: false }
);
