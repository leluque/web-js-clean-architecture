const MongoDBConnection = require('../persistence/mongoose/connection');
const TypeORMConnection = require('../persistence/typeorm/connection');
const { logger } = require('../log/index');

let inMemoryUserRepository;

async function getUserRepository() {
  const type = process.env.REPOSITORY_TYPE;
  if (process.env.NODE_ENV === 'test') {
    logger.debug('Returning connection to database using memory database.');
    if (!inMemoryUserRepository) {
      const InMemoryUserRepository = require('./memory/user/userRepository');
      inMemoryUserRepository = new InMemoryUserRepository();
    }
    return inMemoryUserRepository;
  } else if (type === 'mongoose') {
    logger.debug('Returning connection to MongoDB.');
    await MongoDBConnection.connect();
    const MongooseUserRepository = require('./mongoose/user/userRepository');
    return new MongooseUserRepository();
  } else if (type === 'typeorm') {
    logger.debug('Returning connection to database using TypeORM.');
    await TypeORMConnection.connect();
    const TypeormUserRepository = require('./typeorm/user/userRepository');
    return new TypeormUserRepository();
  } else {
    // MySQL is the default
    logger.debug('Returning connection to database using default MySQL driver.');
    const MysqlUserRepository = require('./mysql/user/userRepository');
    return new MysqlUserRepository();
  }
}

module.exports = { getUserRepository };
