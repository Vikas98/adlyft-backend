const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

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

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/slots', adSlotRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/serve', servingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/publisher', publisherSlotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Adlyft API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = app;
