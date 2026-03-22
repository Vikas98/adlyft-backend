const notificationService = require('../services/notification.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('NotificationController');

const getNotifications = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await notificationService.getNotifications({ userId: req.user._id, ...req.query });
  res.json({ success: true, ...result });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const count = await notificationService.getUnreadCount(req.user._id);
  res.json({ success: true, data: { count } });
});

const markAsRead = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { notificationId: req.params.id });
  const notification = await notificationService.markAsRead({ notificationId: req.params.id, userId: req.user._id });
  res.json({ success: true, data: notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  await notificationService.markAllAsRead(req.user._id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { notificationId: req.params.id });
  await notificationService.deleteNotification({ notificationId: req.params.id, userId: req.user._id });
  res.json({ success: true, message: 'Notification deleted' });
});

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification };
