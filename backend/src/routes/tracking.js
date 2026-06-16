const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');
const { generateId } = require('../utils/auth');

router.post('/location', authenticate, (req, res, next) => {
  const { tripId, latitude, longitude } = req.body;
  if (!tripId || latitude == null || longitude == null) return res.status(400).json({ error: 'Missing location data' });

  const id = generateId();
  const recordedAt = new Date().toISOString();

  db.run(
    `INSERT INTO tracking_entries (id, tripId, latitude, longitude, recordedAt) VALUES (?, ?, ?, ?, ?)`,
    [id, tripId, latitude, longitude, recordedAt],
    function (err) {
      if (err) return next(err);
      res.json({ success: true, tripId, latitude, longitude, recordedAt });
    }
  );
});

router.get('/trip/:tripId', authenticate, (req, res, next) => {
  const { tripId } = req.params;
  db.all('SELECT latitude, longitude, recordedAt FROM tracking_entries WHERE tripId = ? ORDER BY recordedAt ASC', [tripId], (err, rows) => {
    if (err) return next(err);
    res.json({ entries: rows });
  });
});

module.exports = router;
