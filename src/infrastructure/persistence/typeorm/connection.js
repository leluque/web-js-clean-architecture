const { createConnection, getConnection } = require('typeorm');
const { logger } = require('@infrastructure/log');

/**
 * @class TypeORMConnection
 * @description Manages TypeORM connection
 */
class TypeORMConnection {
  /**
   * @static
   * @method connect
   * @description Establishes a connection to the database using TypeORM
   * @returns {Promise<void>}
   */
  static async connect() {
    try {
      // Check if connection already exists
      try {
        const existingConnection = getConnection();
        if (existingConnection.isConnected) {
          return; // Already connected
        }
      } catch (error) {
        // Connection doesn't exist, continue to create one
      }

      await createConnection({
        type: process.env.TYPEORM_CONNECTION || 'mysql',
        host: process.env.TYPEORM_HOST || process.env.DB_HOST,
        port: process.env.TYPEORM_PORT || 3306,
        username: process.env.TYPEORM_USERNAME || process.env.DB_USER,
        password: process.env.TYPEORM_PASSWORD || process.env.DB_PASSWORD,
        database: process.env.TYPEORM_DATABASE || process.env.DB_NAME,
        entities: [__dirname + '/entities/*.js'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
      });

      logger.debug('TypeORM connection established successfully');
    } catch (error) {
      logger.error('TypeORM connection error:', error);
      throw error;
    }
  }

  /**
   * @static
   * @method disconnect
   * @description Closes the TypeORM connection
   * @returns {Promise<void>}
   */
  static async disconnect() {
    try {
      const connection = getConnection();
      if (connection.isConnected) {
        await connection.close();
        logger.debug('TypeORM connection closed');
      }
    } catch (error) {
      logger.error('Error closing TypeORM connection:', error);
    }
  }
}

module.exports = TypeORMConnection;
