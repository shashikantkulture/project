const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateUser } = require('../middleware/auth');

// GET /api/notifications — Get relevant notifications
router.get('/notifications', authenticateUser, (req, res) => {
  try {
    const isStaffOrAdmin = ['staff', 'admin', 'super_admin'].includes(req.user.role);

    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.id];

    if (isStaffOrAdmin) {
      sql += ' OR role_target = ? OR role_target = ? OR role_target = "all"';
      params.push('staff', 'admin');
    } else {
      sql += ' OR role_target = "customer" OR role_target = "all"';
    }

    sql += ' ORDER BY created_at DESC LIMIT 30';

    const notifications = db.query(sql, params);
    const unreadCount = notifications.filter(n => n.is_read === 0).length;

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
});

// PUT /api/notifications/:id/read — Mark as read
router.put('/notifications/:id/read', authenticateUser, (req, res) => {
  try {
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notification.' });
  }
});

// PUT /api/notifications/read-all — Mark all as read
router.put('/notifications/read-all', authenticateUser, (req, res) => {
  try {
    db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ? OR role_target = ?', [req.user.id, req.user.role]);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
});

module.exports = router;
