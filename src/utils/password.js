const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

async function hashToken(token) {
  return bcrypt.hash(token, SALT_ROUNDS);
}

async function compareToken(token, hash) {
  return bcrypt.compare(token, hash);
}


module.exports = {
  hashPassword,
  comparePassword,
  hashToken,
  compareToken
};