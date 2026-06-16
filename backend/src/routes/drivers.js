const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { generateId } = require('../utils/auth');

router.post('/trip', authenticate, requireRole('driver'), (req, res, next) => {
  const { origin, destination, routeGeo, departureTime, seatsAvailable, parcelCapacityKg, notes } = req.body;
  if (!origin || !destination || !routeGeo || !departureTime || seatsAvailable == null || parcelCapacityKg == null) {
    return res.status(400).json({ error: 'Missing trip details' });
  }

  const id = generateId();
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO trips (id, driverId, origin, destination, routeGeo, departureTime, seatsAvailable, parcelCapacityKg, notes, isActive, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [id, req.user.id, origin, destination, JSON.stringify(routeGeo), departureTime, seatsAvailable, parcelCapacityKg, notes || '', createdAt],
    function (err) {
      if (err) return next(err);
      res.json({ tripId: id, origin, destination, departureTime, seatsAvailable, parcelCapacityKg, notes });
    }
  );
});

router.get('/trips', authenticate, requireRole('driver'), (req, res, next) => {
  db.all('SELECT * FROM trips WHERE driverId = ?', [req.user.id], (err, rows) => {
    if (err) return next(err);
    const trips = rows.map((row) => ({ ...row, routeGeo: JSON.parse(row.routeGeo) }));
    res.json({ trips });
  });
});

router.get('/requests', authenticate, requireRole('driver'), (req, res, next) => {
  db.all(
    `SELECT rr.id, rr.userId, rr.tripId, rr.pickupLocation, rr.dropoffLocation, rr.status, rr.createdAt, u.name, u.email, u.phone
    FROM ride_requests rr
    JOIN users u ON u.id = rr.userId
    WHERE rr.tripId IN (SELECT id FROM trips WHERE driverId = ?)`,
    [req.user.id],
    (err, rows) => {
      if (err) return next(err);
      res.json({ requests: rows });
    }
  );
});

router.post('/accept-rider', authenticate, requireRole('driver'), (req, res, next) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'requestId is required' });

  db.run(
    `UPDATE ride_requests SET status = 'accepted' WHERE id = ? AND tripId IN (SELECT id FROM trips WHERE driverId = ?)`,
    [requestId, req.user.id],
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) return res.status(404).json({ error: 'Ride request not found' });
      res.json({ success: true, requestId });
    }
  );
});

module.exports = router;
