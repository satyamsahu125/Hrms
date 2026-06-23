const { getDashboardStats } = require('../services/dashboardService');
const { getUnreadCount, getRecentNotifications } = require('../services/notificationService');

exports.index = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    const notifications = await getRecentNotifications(req.session.user._id, 5);
    const unreadCount = await getUnreadCount(req.session.user._id);

    const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = new Array(12).fill(0);
    stats.salaryChart.forEach((item) => {
      chartData[item._id - 1] = item.total;
    });

    res.render('dashboard/index', {
      title: 'Dashboard',
      stats,
      notifications,
      unreadCount,
      chartLabels,
      chartData
    });
  } catch (err) {
    console.error(err);
    res.render('dashboard/index', {
      title: 'Dashboard',
      stats: {},
      notifications: [],
      unreadCount: 0,
      chartLabels: [],
      chartData: []
    });
  }
};
