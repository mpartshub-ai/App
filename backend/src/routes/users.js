const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

router.get('/history', authenticate, (req, res, next) => {
  const userId = req.user.id;

  db.serialize(() => {
    db.all(
      `SELECT rr.id, rr.tripId, rr.pickupLocation, rr.dropoffLocation, rr.status, rr.createdAt, t.origin, t.destination, t.departureTime
      FROM ride_requests rr
      LEFT JOIN trips t ON t.id = rr.tripId
      WHERE rr.userId = ?`,
      [userId],
      (err, rides) => {
        if (err) return next(err);
        db.all(
          `SELECT p.id, p.tripId, p.recipientName, p.pickupLocation, p.dropoffLocation, p.status, p.createdAt, p.collectedAt, p.deliveredAt
          FROM parcels p
          WHERE p.senderId = ?`,
          [userId],
          (parcelErr, parcels) => {
            if (parcelErr) return next(parcelErr);
            res.json({ rides, parcels });
          }
        );
      }
    );
  });
});

module.exports = router;
