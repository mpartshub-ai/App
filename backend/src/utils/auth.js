const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'route-share-secret';
const OTP_LENGTH = 6;

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateId() {
  return uuidv4();
}

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  generateOtpCode,
  generateId
};
