const express = require('express');
const cors = require('cors');
const { initialize } = require('./db');
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const passengerRoutes = require('./routes/passengers');
const parcelRoutes = require('./routes/parcels');
const adminRoutes = require('./routes/admin');
const trackingRoutes = require('./routes/tracking');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

initialize();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'route-share-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tracking', trackingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
