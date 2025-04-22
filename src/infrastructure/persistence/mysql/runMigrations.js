const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Creates a connection to the MySQL database
 * @returns {Promise<mysql.Connection>} MySQL connection
 */
async function createConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wp2_base_api',
    multipleStatements: true, // Enable running multiple SQL statements
  });
}

/**
 * Creates migrations table if it doesn't exist
 * @param {mysql.Connection} connection MySQL connection
 */
async function ensureMigrationsTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Gets list of executed migrations
 * @param {mysql.Connection} connection MySQL connection
 * @returns {Promise<string[]>} List of executed migration names
 */
async function getExecutedMigrations(connection) {
  const [rows] = await connection.execute('SELECT name FROM migrations ORDER BY id');
  return rows.map((row) => row.name);
}

/**
 * Runs all pending migrations
 */
async function runMigrations() {
  let connection;
  try {
    connection = await createConnection();
    await ensureMigrationsTable(connection);

    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations(connection);

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in order

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrations.includes(file)) {
        //logger.debug(`Running migration: ${file}`);
        const migrationContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

        // Run migration and record it
        await connection.beginTransaction();
        try {
          await connection.query(migrationContent);
          await connection.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
          await connection.commit();
          //logger.debug(`Successfully executed migration: ${file}`);
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      }
    }

    //logger.debug('All migrations completed successfully!');
  } catch (error) {
    //logger.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
