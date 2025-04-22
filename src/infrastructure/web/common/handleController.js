const { logger } = require('@infrastructure/log');

function handleController(controllerMethod) {
  return async function (req) {
    try {
      const wrappedRequest = req.wrappedRequest || req;
      const responseWrapper = req.responseWrapper;

      const { payload, statusCode = 200 } = await controllerMethod(wrappedRequest.getRequestData());
      responseWrapper.send(payload, statusCode);
    } catch (err) {
      logger.error('Controller error:', err);
      req.responseWrapper.send({ error: 'Internal server error' }, 500);
    }
  };
}

module.exports = { handleController };
