db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'app_db',
    },
  ],
});
