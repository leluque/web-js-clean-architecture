const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @class UserSchema
 * @description Mongoose schema for User model
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  emailValidationToken: {
    type: String,
    default: null,
  },
  emailValidationTokenValidThru: {
    type: Date,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('User', UserSchema);
