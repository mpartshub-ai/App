const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('admin'));

router.get('/drivers', (req, res, next) => {
  db.all('SELECT id, name, email, phone, role, isVerified, isApproved, createdAt FROM users WHERE role = ?', ['driver'], (err, rows) => {
    if (err) return next(err);
    res.json({ drivers: rows });
  });
});

router.post('/approve-driver', (req, res, next) => {
  const { driverId } = req.body;
  if (!driverId) return res.status(400).json({ error: 'driverId is required' });

  db.run('UPDATE users SET isApproved = 1 WHERE id = ? AND role = ?', [driverId, 'driver'], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Driver not found' });
    res.json({ success: true, driverId });
  });
});

router.get('/reports', (req, res, next) => {
  db.serialize(() => {
    db.get('SELECT COUNT(*) AS userCount FROM users', [], (err, userRow) => {
      if (err) return next(err);
      db.get('SELECT COUNT(*) AS tripCount FROM trips', [], (err2, tripRow) => {
        if (err2) return next(err2);
        db.get('SELECT COUNT(*) AS parcelCount FROM parcels', [], (err3, parcelRow) => {
          if (err3) return next(err3);
          res.json({ userCount: userRow.userCount, tripCount: tripRow.tripCount, parcelCount: parcelRow.parcelCount });
        });
      });
    });
  });
});

module.exports = router;
