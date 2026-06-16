const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { hashPassword, comparePassword, signToken, generateOtpCode, generateId } = require('../utils/auth');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const passwordHash = await hashPassword(password);
    const id = generateId();
    const createdAt = new Date().toISOString();

    db.run(
      `INSERT INTO users (id, name, email, phone, role, passwordHash, isVerified, isApproved, createdAt) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)`,
      [id, name, email.toLowerCase(), phone || '', role, passwordHash, createdAt],
      function (err) {
        if (err) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.json({ id, name, email, role, isVerified: 0, isApproved: role === 'driver' ? 0 : 1 });
      }
    );
  } catch (err) {
    next(err);
  }
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, role: user.role, email: user.email, name: user.name });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved } });
  });
});

router.post('/verify-otp', (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });

  db.get('SELECT u.id FROM users u JOIN otps o ON u.id = o.userId WHERE u.email = ? AND o.code = ? AND o.expiresAt > ?', [email.toLowerCase(), code, Date.now()], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(400).json({ error: 'Invalid or expired OTP' });

    db.run('UPDATE users SET isVerified = 1 WHERE id = ?', [row.id], (updateErr) => {
      if (updateErr) return next(updateErr);
      res.json({ success: true });
    });
  });
});

router.post('/request-otp', (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()], (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const code = generateOtpCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const otpId = generateId();

    db.run('INSERT INTO otps (id, userId, code, expiresAt) VALUES (?, ?, ?, ?)', [otpId, user.id, code, expiresAt], (insertErr) => {
      if (insertErr) return next(insertErr);
      res.json({ success: true, otp: code, message: 'OTP generated. In a real app send via email/SMS.' });
    });
  });
});

module.exports = router;
