const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// GET /api/users — List all user accounts (Admin only)
router.get('/users', requireAdmin, (req, res) => {
  try {
    const { role, status, search } = req.query;
    let sql = 'SELECT id, name, email, phone, address, role, status, created_at, updated_at FROM users WHERE 1=1';
    const params = [];

    if (role && role !== 'All') {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?))';
      const q = `%${search.trim()}%`;
      params.push(q, q);
    }

    sql += ' ORDER BY created_at DESC';

    const users = db.query(sql, params);
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving user accounts.' });
  }
});

// POST /api/users — Admin create staff/admin/customer user
router.post('/users', requireAdmin, (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and initial password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address is already in use.' });
    }

    // Only super_admin can create another super_admin
    const targetRole = role || 'customer';
    if (targetRole === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only Super Administrators can create Super Admin accounts.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO users (id, name, email, password_hash, phone, address, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `, [userId, name.trim(), normalizedEmail, passwordHash, phone || '', address || '', targetRole, now, now]);

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'USER_CREATED_BY_ADMIN', 'users', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, userId, `Created user: ${normalizedEmail} (Role: ${targetRole})`, req.ip || '127.0.0.1', now]);

    const created = db.get('SELECT id, name, email, phone, address, role, status, created_at FROM users WHERE id = ?', [userId]);
    res.status(201).json({ success: true, user: created });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Failed to create user account.' });
  }
});

// PUT /api/users/:id — Edit user details & role
router.put('/users/:id', requireAdmin, (req, res) => {
  try {
    const existing = db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'User not found.' });

    const { name, email, role, phone, address, status } = req.body;

    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only Super Admins can promote to Super Admin.' });
    }

    const now = new Date().toISOString();

    db.run(`
      UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        status = COALESCE(?, status),
        updated_at = ?
      WHERE id = ?
    `, [
      name ? name.trim() : null,
      email ? email.trim().toLowerCase() : null,
      role || null,
      phone || null,
      address || null,
      status || null,
      now,
      req.params.id
    ]);

    const updated = db.get('SELECT id, name, email, phone, address, role, status, updated_at FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, user: updated });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Failed to update user account.' });
  }
});

// PUT /api/users/:id/reset-password — Admin reset password
router.put('/users/:id/reset-password', requireAdmin, (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);
    const now = new Date().toISOString();

    db.run('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [passwordHash, now, req.params.id]);

    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'USER_PASSWORD_RESET', 'users', ?, 'Password reset by admin', ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, req.params.id, req.ip || '127.0.0.1', now]);

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ success: false, message: 'Failed to reset user password.' });
  }
});

// DELETE /api/users/:id — Admin delete user
router.delete('/users/:id', requireSuperAdmin, (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own active administrator account.' });
    }

    db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User account removed.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

module.exports = router;
