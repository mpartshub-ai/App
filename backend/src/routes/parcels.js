const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { generateId } = require('../utils/auth');

router.post('/', authenticate, requireRole('sender'), (req, res, next) => {
  const { recipientName, recipientPhone, pickupLocation, dropoffLocation, weightKg, size, tripId } = req.body;
  if (!recipientName || !recipientPhone || !pickupLocation || !dropoffLocation || weightKg == null || !size) {
    return res.status(400).json({ error: 'Missing parcel details' });
  }

  const id = generateId();
  const barcode = `PS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const qrData = JSON.stringify({ parcelId: id, barcode });
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO parcels (id, senderId, tripId, recipientName, recipientPhone, pickupLocation, dropoffLocation, weightKg, size, barcode, qrData, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', ?)`,
    [id, req.user.id, tripId || null, recipientName, recipientPhone, pickupLocation, dropoffLocation, weightKg, size, barcode, qrData, createdAt],
    function (err) {
      if (err) return next(err);
      res.json({ parcelId: id, barcode, qrData, status: 'created' });
    }
  );
});

router.get('/:id', authenticate, (req, res, next) => {
  const { id } = req.params;
  db.get('SELECT * FROM parcels WHERE id = ?', [id], (err, parcel) => {
    if (err) return next(err);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json(parcel);
  });
});

router.post('/scan', authenticate, (req, res, next) => {
  const { barcode, scanType } = req.body;
  if (!barcode || !scanType) return res.status(400).json({ error: 'barcode and scanType are required' });

  const validTypes = ['collected', 'delivered'];
  if (!validTypes.includes(scanType)) return res.status(400).json({ error: 'Invalid scanType' });

  db.get('SELECT * FROM parcels WHERE barcode = ?', [barcode], (err, parcel) => {
    if (err) return next(err);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });

    const timestamp = new Date().toISOString();
    const newStatus = scanType === 'collected' ? 'collected' : 'delivered';
    const dateField = scanType === 'collected' ? 'collectedAt' : 'deliveredAt';

    db.run(`UPDATE parcels SET status = ?, ${dateField} = ? WHERE id = ?`, [newStatus, timestamp, parcel.id], function (updateErr) {
      if (updateErr) return next(updateErr);
      const scanId = generateId();
      db.run(
        `INSERT INTO parcel_scans (id, parcelId, scannedBy, scanType, scannedAt) VALUES (?, ?, ?, ?, ?)`,
        [scanId, parcel.id, req.user.id, scanType, timestamp],
        (scanErr) => {
          if (scanErr) return next(scanErr);
          res.json({ parcelId: parcel.id, status: newStatus, scannedAt: timestamp });
        }
      );
    });
  });
});

router.get('/track/:barcode', authenticate, (req, res, next) => {
  const { barcode } = req.params;
  db.get('SELECT * FROM parcels WHERE barcode = ?', [barcode], (err, parcel) => {
    if (err) return next(err);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json(parcel);
  });
});

module.exports = router;
