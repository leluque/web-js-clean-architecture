const { logger } = require('@infrastructure/log');

/**
 * Global error handler middleware
 * Handles different types of errors and returns appropriate HTTP status codes
 */
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (err.message === 'User not found') {
    return res.status(404).json({ error: 'User not found' });
  }

  if (err.message === 'User with this email already exists') {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  if (err.message === 'Account is disabled') {
    return res.status(403).json({ error: 'Account is disabled' });
  }

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
