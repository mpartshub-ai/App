const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');
const { generateId } = require('../utils/auth');

router.post('/', authenticate, (req, res, next) => {
  const { amount, method, targetType, targetId } = req.body;
  if (amount == null || !method || !targetType) return res.status(400).json({ error: 'Missing payment data' });

  const id = generateId();
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO payments (id, userId, amount, method, targetType, targetId, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, 'completed', ?)`,
    [id, req.user.id, amount, method, targetType, targetId || null, createdAt],
    function (err) {
      if (err) return next(err);
      res.json({ paymentId: id, status: 'completed', amount, method, targetType, targetId });
    }
  );
});

router.get('/history', authenticate, (req, res, next) => {
  db.all('SELECT id, amount, method, targetType, targetId, status, createdAt FROM payments WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) return next(err);
    res.json({ payments: rows });
  });
});

module.exports = router;
