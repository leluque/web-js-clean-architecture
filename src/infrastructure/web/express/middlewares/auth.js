const jwt = require('jsonwebtoken');

/**
 * JWT validation middleware
 * Validates the authorization token in the request header
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No token provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new Error('Invalid token format');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.headers.loggedUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
