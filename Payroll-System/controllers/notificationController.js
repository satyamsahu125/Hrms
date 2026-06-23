const {
  getRecentNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../services/notificationService');

exports.list = async (req, res) => {
  const notifications = await getRecentNotifications(req.session.user._id, 50);
  res.render('notifications/index', { title: 'Notifications', notifications });
};

exports.markRead = async (req, res) => {
  await markAsRead(req.params.id, req.session.user._id);
  if (req.xhr) return res.json({ success: true });
  res.redirect('/notifications');
};

exports.markAllRead = async (req, res) => {
  await markAllAsRead(req.session.user._id);
  req.session.success = 'All notifications marked as read';
  res.redirect('/notifications');
};

exports.apiUnread = async (req, res) => {
  const count = await getUnreadCount(req.session.user._id);
  const notifications = await getRecentNotifications(req.session.user._id, 5);
  res.json({ count, notifications });
};
