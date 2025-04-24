// Load environment variables
require('dotenv').config();
// Configure the application to use module aliases
require('module-alias/register');

let startServer;

// In a real application, we would choose between one of the two web frameworks
// but for this example, we will offer the possibility to choose between them
// using an environment variable.
// This is not something we would do in a real application.
// Nonetheless, this code is here to show how we can easily change the framework
// we are using.

if (process.env.WEB_FRAMEWORK && process.env.WEB_FRAMEWORK.toLowerCase() === 'fastify') {
  ({ startServer } = require('./fastify/app'));
} else {
  // Express is selected by default
  ({ startServer } = require('./express/app'));
}

/**
 * @function startApp
 * @description Initializes and starts the application. This function was created to allow easily changing
 * express by other frameworks in the future.
 */
async function startApp() {
  await startServer();
}

module.exports = { startApp };
