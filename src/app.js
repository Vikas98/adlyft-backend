const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter, servingLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth.routes');
const campaignRoutes = require('./routes/campaign.routes');
const publisherRoutes = require('./routes/publisher.routes');
const adSlotRoutes = require('./routes/adSlot.routes');
const adRoutes = require('./routes/ad.routes');
const servingRoutes = require('./routes/serving.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const billingRoutes = require('./routes/billing.routes');
const settingsRoutes = require('./routes/settings.routes');
const publisherSlotRoutes = require('./routes/publisherSlot.routes');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/campaigns', apiLimiter, campaignRoutes);
app.use('/api/publishers', apiLimiter, publisherRoutes);
app.use('/api/slots', apiLimiter, adSlotRoutes);
app.use('/api/ads', apiLimiter, adRoutes);
app.use('/api/serve', servingLimiter, servingRoutes);
app.use('/api/analytics', apiLimiter, analyticsRoutes);
app.use('/api/billing', apiLimiter, billingRoutes);
app.use('/api/settings', apiLimiter, settingsRoutes);
app.use('/api/publisher', apiLimiter, publisherSlotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Adlyft API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = app;
