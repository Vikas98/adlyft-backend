const userService = require('../services/user.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('UserController');

const getUsers = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await userService.getUsers(req.query);
  res.json({ success: true, ...result });
});

const getUser = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.params.id });
  const user = await userService.getUser(req.params.id);
  res.json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.params.id });
  const user = await userService.updateUser(req.params.id, req.body);
  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.params.id });
  await userService.deleteUser(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

module.exports = { getUsers, getUser, updateUser, deleteUser };
