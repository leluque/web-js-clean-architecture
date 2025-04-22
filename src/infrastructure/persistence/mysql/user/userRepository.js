const mysql = require('mysql2/promise');
const { User } = require('@business/user/user');
const UserRepository = require('@business/user/userRepository');

/**
 * @class MySQLUserRepository
 * @description MySQL implementation of the UserRepository interface for user data persistence
 * @extends UserRepository
 */
class MySQLUserRepository extends UserRepository {
  /**
   * @constructor
   * @description Initializes a new instance of MySQLUserRepository with a connection pool
   */
  constructor() {
    super();
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  /**
   * @async
   * @method create
   * @description Creates a new user in the database
   * @param {Object} user - The user object to create
   * @returns {Promise<Object>} The created user with assigned ID
   */
  async create(user) {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, email_validated, disabled, created_at, updated_at, email_validation_token, email_validation_token_valid_thru, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          user.name,
          user.email,
          user.password,
          user.emailValidated,
          user.disabled,
          user.createdAt,
          user.updatedAt,
          user.emailValidationToken,
          user.emailValidationTokenValidThru,
          user.profileImage,
        ]
      );

      user.id = result.insertId;
      return user;
    } finally {
      connection.release();
    }
  }

  /**
   * @async
   * @method findById
   * @description Finds a user by their ID
   * @param {string|number} id - The ID of the user to find
   * @returns {Promise<Object|null>} The found user or null if not found
   */
  async findById(id) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) return null;

      return new User({
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        password: rows[0].password,
        emailValidated: rows[0].email_validated,
        disabled: rows[0].disabled,
        createdAt: new Date(rows[0].created_at),
        updatedAt: new Date(rows[0].updated_at),
        emailValidationToken: rows[0].email_validation_token,
        emailValidationTokenValidThru: rows[0].email_validation_token_valid_thru
          ? new Date(rows[0].email_validation_token_valid_thru)
          : null,
        profileImage: rows[0].profile_image,
      });
    } finally {
      connection.release();
    }
  }

  /**
   * @async
   * @method findByEmailValidationToken
   * @description Finds a user by their e-mail validation token
   * @param {string} token - The e-mail validation token of the user to find
   * @returns {Promise<Object|null>} The found user or null if not found
   */
  async findByEmailValidationToken(token) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE email_validation_token = ?',
        [token]
      );
      if (rows.length === 0) return null;

      return new User({
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        password: rows[0].password,
        emailValidated: rows[0].email_validated,
        disabled: rows[0].disabled,
        createdAt: new Date(rows[0].created_at),
        updatedAt: new Date(rows[0].updated_at),
        emailValidationToken: rows[0].email_validation_token,
        emailValidationTokenValidThru: rows[0].email_validation_token_valid_thru
          ? new Date(rows[0].email_validation_token_valid_thru)
          : null,
        profileImage: rows[0].profile_image,
      });
    } finally {
      connection.release();
    }
  }

  /**
   * @async
   * @method findByEmail
   * @description Finds a user by their email address
   * @param {string} email - The email address to search for
   * @returns {Promise<Object|null>} The found user or null if not found
   */
  async findByEmail(email) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) return null;

      return new User({
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        password: rows[0].password,
        emailValidated: rows[0].email_validated,
        disabled: rows[0].disabled,
        createdAt: new Date(rows[0].created_at),
        updatedAt: new Date(rows[0].updated_at),
        emailValidationToken: rows[0].email_validation_token,
        emailValidationTokenValidThru: rows[0].email_validation_token_valid_thru
          ? new Date(rows[0].email_validation_token_valid_thru)
          : null,
        profileImage: rows[0].profile_image,
      });
    } finally {
      connection.release();
    }
  }

  /**
   * @async
   * @method update
   * @description Updates an existing user in the database
   * @param {Object} user - The user object with updated properties
   * @returns {Promise<Object>} The updated user object
   */
  async update(user) {
    const connection = await this.pool.getConnection();
    try {
      await connection.query(
        'UPDATE users SET name = ?, email = ?, password = ?, email_validated = ?, disabled = ?, updated_at = ?, email_validation_token = ?, email_validation_token_valid_thru = ?, profile_image = ? WHERE id = ?',
        [
          user.name,
          user.email,
          user.password,
          user.emailValidated,
          user.disabled,
          user.updatedAt,
          user.emailValidationToken,
          user.emailValidationTokenValidThru,
          user.profileImage,
          user.id,
        ]
      );

      return user;
    } finally {
      connection.release();
    }
  }

  /**
   * @async
   * @method findAll
   * @description Finds all users
   * @returns {Promise<Object[]>} The found users
   */
  async findAll() {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users');
      const result = [];

      for (const row of rows) {
        result.push(
          new User({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            emailValidated: row.email_validated,
            disabled: row.disabled,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
            emailValidationToken: row.email_validation_token,
            emailValidationTokenValidThru: row.email_validation_token_valid_thru
              ? new Date(row.email_validation_token_valid_thru)
              : null,
            profileImage: row.profile_image,
          })
        );
      }
      return result;
    } finally {
      connection.release();
    }
  }

  /**
   * @async
   * @method delete
   * @description Deletes a user from the database by their ID
   * @param {string|number} id - The ID of the user to delete
   * @returns {Promise<void>}
   */
  async delete(id) {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('DELETE FROM users WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }
}

module.exports = MySQLUserRepository;
