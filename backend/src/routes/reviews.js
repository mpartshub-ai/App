const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { generateId } = require('../utils/auth');

router.post('/', authenticate, (req, res, next) => {
  const { driverId, tripId, rating, comment } = req.body;
  if (!driverId || rating == null) return res.status(400).json({ error: 'Missing review data' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  const id = generateId();
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO reviews (id, reviewerId, driverId, tripId, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, req.user.id, driverId, tripId || null, rating, comment || '', createdAt],
    function (err) {
      if (err) return next(err);
      res.json({ reviewId: id, rating, comment, createdAt });
    }
  );
});

router.get('/driver/:driverId', authenticate, (req, res, next) => {
  const { driverId } = req.params;
  db.all('SELECT reviewerId, rating, comment, createdAt FROM reviews WHERE driverId = ?', [driverId], (err, rows) => {
    if (err) return next(err);
    res.json({ reviews: rows });
  });
});

module.exports = router;
