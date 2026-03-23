const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { authenticate, requireRole, requireApproved } = require('./middleware/auth');
const createLogger = require('./utils/logger');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin/index');
const publisherRoutes = require('./routes/publisher/index');
const advertiserRoutes = require('./routes/advertiser/index');

const logger = createLogger('App');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', apiLimiter, authenticate, requireRole('admin'), adminRoutes);
app.use('/api/publisher', apiLimiter, authenticate, requireRole('publisher'), requireApproved, publisherRoutes);
app.use('/api/advertiser', apiLimiter, authenticate, requireRole('advertiser'), advertiserRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Adlyft API is running', timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

app.use(errorHandler);

module.exports = app;
