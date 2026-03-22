const authService = require('../services/auth.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('AuthController');

const register = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await authService.register(req.body);
  logger.info('Responding 201 — user registered');
  res.status(201).json({ success: true, ...result });
});

const login = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await authService.login(req.body);
  logger.info('Responding 200 — user logged in');
  res.json({ success: true, ...result });
});

const getMe = asyncHandler((req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const user = authService.getMe(req.user);
  res.json({ success: true, user });
});

module.exports = { register, login, getMe };
