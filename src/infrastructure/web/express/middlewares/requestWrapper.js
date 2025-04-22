const { RequestWrapper } = require('../../common/requestWrapper');
const { ResponseWrapper } = require('../../common/responseWrapper');

const wrapRequest = (req, res, next) => {
  const requestData = {
    originalRequest: req,
    getRequestData: (originalRequest) => ({
      headers: originalRequest.headers || {},
      params: originalRequest.params || {},
      query: originalRequest.query || {},
      originalUrl: originalRequest.originalUrl,
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
    res.status(statusCode).json(payload);
  });
  next();
};

module.exports = wrapRequest;
