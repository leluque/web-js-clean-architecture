const { EntitySchema } = require('typeorm');

/**
 * @description TypeORM entity schema for User
 */
module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email_validated: {
      name: 'email_validated',
      type: 'boolean',
      default: false,
    },
    disabled: {
      type: 'boolean',
      default: false,
    },
    created_at: {
      name: 'created_at',
      type: 'datetime',
      createDate: true,
    },
    updated_at: {
      name: 'updated_at',
      type: 'datetime',
      updateDate: true,
    },
    email_validation_token: {
      name: 'email_validation_token',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    email_validation_token_valid_thru: {
      name: 'email_validation_token_valid_thru',
      type: 'datetime',
      nullable: true,
    },
    profile_image: {
      name: 'profile_image',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
  },
});
