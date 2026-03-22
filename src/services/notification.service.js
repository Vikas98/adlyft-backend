const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const createLogger = require('../utils/logger');

const logger = createLogger('NotificationService');

const getNotifications = async ({ userId, read, page = 1, limit = 20 }) => {
  logger.debug('Fetching notifications', { userId, read, page, limit });
  const filter = { userId };
  if (read !== undefined && read !== '') {
    filter.read = read === true || read === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Notification.countDocuments(filter),
  ]);

  logger.debug('Notifications fetched', { count: notifications.length, total });
  return {
    data: notifications,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  };
};

const getUnreadCount = async (userId) => {
  logger.debug('Fetching unread notification count', { userId });
  const count = await Notification.countDocuments({ userId, read: false });
  return count;
};

const markAsRead = async ({ notificationId, userId }) => {
  logger.info('Marking notification as read', { notificationId, userId });
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
  if (!notification) {
    logger.warn('Notification not found for markAsRead', { notificationId, userId });
    throw new AppError('Notification not found', 404);
  }
  return notification;
};

const markAllAsRead = async (userId) => {
  logger.info('Marking all notifications as read', { userId });
  const result = await Notification.updateMany({ userId, read: false }, { read: true });
  logger.info('All notifications marked as read', { userId, modified: result.modifiedCount });
  return result;
};

const createNotification = async ({ userId, type, title, message, metadata = {} }) => {
  logger.info('Creating notification', { userId, type, title });
  const notification = await Notification.create({ userId, type, title, message, metadata });
  logger.info('Notification created', { notificationId: notification._id, userId });
  return notification;
};

const deleteNotification = async ({ notificationId, userId }) => {
  logger.info('Deleting notification', { notificationId, userId });
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) {
    logger.warn('Notification not found for deletion', { notificationId, userId });
    throw new AppError('Notification not found', 404);
  }
  return notification;
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification, deleteNotification };
