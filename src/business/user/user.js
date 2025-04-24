class User {
  #_id;
  #_name;
  #_email;
  #_password;
  #_emailValidated;
  #_disabled;
  #_createdAt;
  #_updatedAt;
  #_emailValidationToken;
  #_emailValidationTokenValidThru;
  #_profileImage;

  constructor({
    id = null,
    name,
    email,
    password,
    emailValidated = false,
    disabled = false,
    createdAt = new Date(),
    updatedAt = new Date(),
    emailValidationToken = null,
    emailValidationTokenValidThru = null,
    profileImage = null,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.emailValidated = emailValidated;
    this.disabled = disabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.emailValidationToken = emailValidationToken;
    this.emailValidationTokenValidThru = emailValidationTokenValidThru;
    this.profileImage = profileImage;
  }

  set id(value) {
    this.#_id = value;
  }

  get id() {
    return this.#_id;
  }

  set name(value) {
    if (!value || typeof value !== 'string' || value.trim().length < 2) {
      throw new Error('Name must be a string with at least 2 characters');
    }
    this.#_name = value.trim();
  }

  get name() {
    return this.#_name;
  }

  set email(value) {
    if (!value || !this.#isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
    this.#_email = value.toLowerCase();
  }

  get email() {
    return this.#_email;
  }

  setPassword = async (value, hasher) => {
    if (!value || typeof value !== 'string' || value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!hasher) {
      throw new Error('Password hashing function is required');
    }
    this.#_password = await hasher(value);
  };

  set password(hashedValue) {
    this.#_password = hashedValue;
  }

  get password() {
    return this.#_password;
  }

  set emailValidated(value) {
    if (value === 'true' || value === 1 || value === true) {
      this.#_emailValidated = true;
    } else if (value === 'false' || value === 0 || value === false) {
      this.#_emailValidated = false;
    } else {
      throw new Error('Email validated must be a boolean, 1/0, or "true"/"false" string');
    }
  }
  get emailValidated() {
    return this.#_emailValidated;
  }

  set disabled(value) {
    if (value === 'true' || value === 1 || value === true) {
      this.#_disabled = true;
    } else if (value === 'false' || value === 0 || value === false) {
      this.#_disabled = false;
    } else {
      throw new Error('Disabled must be a boolean, 1/0, or "true"/"false" string');
    }
  }

  get disabled() {
    return this.#_disabled;
  }

  set createdAt(value) {
    if (!(value instanceof Date)) {
      throw new Error('Created at must be a Date object');
    }
    this.#_createdAt = value;
  }

  get createdAt() {
    return this.#_createdAt;
  }

  set updatedAt(value) {
    if (!(value instanceof Date)) {
      throw new Error('Updated at must be a Date object');
    }
    this.#_updatedAt = value;
  }

  get updatedAt() {
    return this.#_updatedAt;
  }

  #isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  disable() {
    this.disabled = true;
    this.updatedAt = new Date();
  }

  enable() {
    this.disabled = false;
    this.updatedAt = new Date();
  }

  validateEmail() {
    this.emailValidated = true;
    this.updatedAt = new Date();
    this.emailValidationToken = null;
    this.emailValidationTokenValidThru = null;
  }

  set emailValidationToken(value) {
    if (value !== null && typeof value !== 'string') {
      throw new Error('Email validation token must be a string or null');
    }
    this.#_emailValidationToken = value;
  }

  get emailValidationToken() {
    return this.#_emailValidationToken;
  }

  set emailValidationTokenValidThru(value) {
    if (value !== null && !(value instanceof Date)) {
      throw new Error('Email validation token valid thru must be a Date object or null');
    }
    this.#_emailValidationTokenValidThru = value;
  }

  get emailValidationTokenValidThru() {
    return this.#_emailValidationTokenValidThru;
  }

  set profileImage(value) {
    if (value !== null && typeof value !== 'string') {
      throw new Error('Profile image must be a string or null');
    }
    this.#_profileImage = value;
  }

  get profileImage() {
    return this.#_profileImage;
  }

  requestEmailValidationToken() {
    const tokenLength = 32;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    // Generate random token
    for (let i = 0; i < tokenLength; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Set token and expiration (24 hours from now)
    this.emailValidationToken = token;
    this.emailValidationTokenValidThru = new Date(Date.now() + 24 * 60 * 60 * 1000);
    this.updatedAt = new Date();

    return this.emailValidationToken;
  }

  isEmailValidationTokenValid() {
    if (!this.emailValidationToken || !this.emailValidationTokenValidThru) {
      return false;
    }
    return this.emailValidationTokenValidThru > new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      emailValidated: this.emailValidated,
      disabled: this.disabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      emailValidationToken: this.emailValidationToken,
      emailValidationTokenValidThru: this.emailValidationTokenValidThru,
      profileImage: this.profileImage,
    };
  }

  get publicData() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      emailValidated: this.emailValidated,
      disabled: this.disabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      profileImage: this.profileImage,
    };
  }
}

module.exports = { User };
