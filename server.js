const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { PORT } = require('./src/config/env');
const createLogger = require('./src/utils/logger');

const logger = createLogger('Server');

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception — shutting down', { message: err.message, stack: err.stack });
  process.exit(1);
});

const startServer = async () => {
  await connectDB();
  await connectRedis();
  const server = app.listen(PORT, () => {
    logger.info(`Adlyft API Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Health: http://localhost:${PORT}/api/health`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection — shutting down', { message: err.message, stack: err.stack });
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
