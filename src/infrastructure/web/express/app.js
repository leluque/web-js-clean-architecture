const express = require('express');
const configureUserRouter = require('./routers/userRouter');
const errorHandler = require('./middlewares/errorHandler');
const requestWrapper = require('./middlewares/requestWrapper');
const http = require('http');
const { logger } = require('@infrastructure/log');

// Create Express app
const app = express();

/**
 * Initialize and start the server
 * @returns {http.Server} The HTTP server instance
 */
const startServer = async () => {
  // Set port from environment variable or default to 3000
  let port = process.env.PORT || 3000;
  const server = http.createServer(app);

  // Function to attempt server start
  const attemptServerStart = async (currentPort) => {
    // Middleware
    app.use(express.json());

    // Serve static files from uploads directory
    app.use('/uploads', express.static('uploads'));

    // Request wrapper middleware
    app.use(requestWrapper);

    // Routes
    app.use('/api/users', await configureUserRouter());

    // Global error handler
    app.use(errorHandler);

    server.listen(currentPort);
  };

  // Handle port in use error
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.debug(`Port ${port} is already in use, trying port ${port + 1}`);
      port += 1;
      attemptServerStart(port);
    } else {
      logger.error('Server error:', error);
      process.exit(1);
    }
  });

  // Server started successfully
  server.on('listening', () => {
    logger.debug(`Server is running on port ${port}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logger.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.debug('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.debug('SIGINT signal received: closing HTTP server');
    server.close(() => {
      logger.debug('HTTP server closed');
      process.exit(0);
    });
  });

  // Start the server
  await attemptServerStart(port);

  return server;
};

module.exports = { app, startServer };
