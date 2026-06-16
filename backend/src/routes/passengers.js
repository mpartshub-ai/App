const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { generateId } = require('../utils/auth');
const { findMatchingTrips } = require('../utils/matching');

router.get('/search', authenticate, requireRole('passenger', 'sender'), (req, res, next) => {
  const { pickup, dropoff } = req.query;
  if (!pickup || !dropoff) return res.status(400).json({ error: 'pickup and dropoff are required' });

  db.all('SELECT * FROM trips WHERE isActive = 1', [], (err, rows) => {
    if (err) return next(err);
    const trips = rows.map((trip) => ({ ...trip, routeGeo: JSON.parse(trip.routeGeo) }));
    const matches = findMatchingTrips(trips, pickup, dropoff);
    res.json({ matches });
  });
});

router.post('/request-ride', authenticate, requireRole('passenger'), (req, res, next) => {
  const { tripId, pickupLocation, dropoffLocation } = req.body;
  if (!tripId || !pickupLocation || !dropoffLocation) return res.status(400).json({ error: 'Missing ride request details' });

  const id = generateId();
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO ride_requests (id, userId, tripId, pickupLocation, dropoffLocation, status, createdAt)
    VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
    [id, req.user.id, tripId, pickupLocation, dropoffLocation, createdAt],
    function (err) {
      if (err) return next(err);
      res.json({ rideRequestId: id, status: 'pending' });
    }
  );
});

module.exports = router;
