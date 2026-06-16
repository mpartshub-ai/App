const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const databaseFile = path.join(dataDir, 'app.db');

fs.mkdirSync(dataDir, { recursive: true });
const db = new sqlite3.Database(databaseFile);

function initialize() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      role TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      isVerified INTEGER DEFAULT 0,
      isApproved INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS otps (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      code TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      driverId TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      routeGeo TEXT NOT NULL,
      departureTime TEXT NOT NULL,
      seatsAvailable INTEGER NOT NULL,
      parcelCapacityKg REAL NOT NULL,
      notes TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (driverId) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ride_requests (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      tripId TEXT NOT NULL,
      pickupLocation TEXT NOT NULL,
      dropoffLocation TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (tripId) REFERENCES trips(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS parcels (
      id TEXT PRIMARY KEY,
      senderId TEXT NOT NULL,
      tripId TEXT,
      recipientName TEXT NOT NULL,
      recipientPhone TEXT NOT NULL,
      pickupLocation TEXT NOT NULL,
      dropoffLocation TEXT NOT NULL,
      weightKg REAL NOT NULL,
      size TEXT NOT NULL,
      barcode TEXT UNIQUE NOT NULL,
      qrData TEXT NOT NULL,
      status TEXT DEFAULT 'created',
      createdAt TEXT NOT NULL,
      collectedAt TEXT,
      deliveredAt TEXT,
      FOREIGN KEY (senderId) REFERENCES users(id),
      FOREIGN KEY (tripId) REFERENCES trips(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tracking_entries (
      id TEXT PRIMARY KEY,
      tripId TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      recordedAt TEXT NOT NULL,
      FOREIGN KEY (tripId) REFERENCES trips(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS parcel_scans (
      id TEXT PRIMARY KEY,
      parcelId TEXT NOT NULL,
      scannedBy TEXT NOT NULL,
      scanType TEXT NOT NULL,
      scannedAt TEXT NOT NULL,
      FOREIGN KEY (parcelId) REFERENCES parcels(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      reviewerId TEXT NOT NULL,
      driverId TEXT NOT NULL,
      tripId TEXT,
      rating INTEGER NOT NULL,
      comment TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (reviewerId) REFERENCES users(id),
      FOREIGN KEY (driverId) REFERENCES users(id),
      FOREIGN KEY (tripId) REFERENCES trips(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      targetType TEXT NOT NULL,
      targetId TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);
  });
}

module.exports = {
  db,
  initialize
};
