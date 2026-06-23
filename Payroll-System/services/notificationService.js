const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type = 'info', link = null, metadata = {}) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
    metadata
  });
};

const notifyUsers = async (userIds, title, message, type = 'info', link = null) => {
  const notifications = userIds.map((userId) => ({
    user: userId,
    title,
    message,
    type,
    link
  }));
  return Notification.insertMany(notifications);
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};

const getRecentNotifications = async (userId, limit = 10) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};

const markAllAsRead = async (userId) => {
  return Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};

module.exports = {
  createNotification,
  notifyUsers,
  getUnreadCount,
  getRecentNotifications,
  markAsRead,
  markAllAsRead
};
