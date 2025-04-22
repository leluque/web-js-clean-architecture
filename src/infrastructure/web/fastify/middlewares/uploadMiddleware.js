// Fastify file upload middleware using fastify-multer
const fp = require('fastify-plugin');
const multer = require('fastify-multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = fp(async function (fastify, opts) {
  await fastify.register(require('@fastify/multipart'));
  fastify.decorate('upload', upload);
});
