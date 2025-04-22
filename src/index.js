const { startApp } = require('./infrastructure/web');

// Initialize and start the application
(async () => {
  await startApp();
})();
