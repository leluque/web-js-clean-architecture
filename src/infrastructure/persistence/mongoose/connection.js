const mongoose = require('mongoose');
const { logger } = require('@infrastructure/log');

/**
 * @class MongoDBConnection
 * @description Manages MongoDB connection using Mongoose
 */
class MongoDBConnection {
  /**
   * @static
   * @method connect
   * @description Establishes a connection to MongoDB
   * @returns {Promise<void>}
   */
  static async connect() {
    if (mongoose.connection.readyState === 1) {
      return; // Already connected
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI, {});
      logger.debug('MongoDB connection established successfully');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * @static
   * @method disconnect
   * @description Closes the MongoDB connection
   * @returns {Promise<void>}
   */
  static async disconnect() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.debug('MongoDB connection closed');
    }
  }
}

module.exports = MongoDBConnection;
