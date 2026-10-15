const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db/database');
const { JWT_SECRET, authenticateUser } = require('../middleware/auth');

// Register New Customer Account
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email address, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account is already registered with this email address.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO users (id, name, email, password_hash, phone, address, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'customer', 'active', ?, ?)
    `, [userId, name.trim(), normalizedEmail, passwordHash, phone || '', address || '', now, now]);

    // Also register in customers table
    const custId = `cust-${Date.now()}`;
    db.run(`
      INSERT INTO customers (id, user_id, full_name, email, phone, company, address, vip_tier, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Patron', 'Registered via public website portal', ?, ?)
    `, [custId, userId, name.trim(), normalizedEmail, phone || '', '', address || '', now, now]);

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'USER_REGISTERED', 'users', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, userId, name.trim(), userId, `New patron registered: ${normalizedEmail}`, req.ip || '127.0.0.1', now]);

    // Create Welcome Notification
    db.run(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, ?, 'customer', 'Welcome to Luxignia Patron Sanctuary', 'Your private account is activated. Explore the artisanal catalog and bespoke Vastu curation.', 'info', 0, '/dashboard', ?)
    `, [`notif-${Date.now()}`, userId, now]);

    // Notify Admins of New Registration
    db.run(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, NULL, 'admin', 'New Patron Registration', ?, 'system', 0, '/admin#users', ?)
    `, [`notif-adm-${Date.now()}`, `Patron ${name.trim()} (${normalizedEmail}) created an account.`, now]);

    const token = jwt.sign({ id: userId, email: normalizedEmail, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('lux_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.status(201).json({
      success: true,
      message: 'Welcome to Luxignia. Account registered successfully.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || '',
        address: address || '',
        role: 'customer'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during account registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email address and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Contact the concierge.' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const now = new Date().toISOString();

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'USER_LOGIN', 'users', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, user.id, user.name, user.id, `User logged in (${user.role})`, req.ip || '127.0.0.1', now]);

    res.cookie('lux_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// Get Current User Profile
router.get('/me', authenticateUser, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Update Profile
router.put('/profile', authenticateUser, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const now = new Date().toISOString();

    db.run(`
      UPDATE users SET name = ?, phone = ?, address = ?, updated_at = ?
      WHERE id = ?
    `, [name ? name.trim() : req.user.name, phone || req.user.phone, address || req.user.address, now, req.user.id]);

    // Also sync customer table if present
    db.run(`
      UPDATE customers SET full_name = ?, phone = ?, address = ?, updated_at = ?
      WHERE user_id = ?
    `, [name ? name.trim() : req.user.name, phone || req.user.phone, address || req.user.address, now, req.user.id]);

    const updatedUser = db.get('SELECT id, name, email, phone, address, role, status FROM users WHERE id = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user profile.' });
  }
});

// Forgot Password Request
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email address is required.' });

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.get('SELECT id, name FROM users WHERE email = ?', [normalizedEmail]);

    if (!user) {
      // Security practice: Return success message to avoid email enumeration
      return res.json({
        success: true,
        message: 'If a matching account exists, a password reset token has been dispatched to your email.'
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO password_resets (id, email, token, expires_at, used, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `, [`rst-${Date.now()}`, normalizedEmail, resetToken, expiresAt, now]);

    res.json({
      success: true,
      message: 'Password reset link and security verification token generated.',
      resetToken // Provided for demonstration & test convenience
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Failed to process password reset request.' });
  }
});

// Reset Password with Token
router.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters.' });
    }

    const reset = db.get('SELECT * FROM password_resets WHERE token = ? AND used = 0', [token]);
    if (!reset) {
      return res.status(400).json({ success: false, message: 'Invalid or already utilized password reset token.' });
    }

    if (new Date() > new Date(reset.expires_at)) {
      return res.status(400).json({ success: false, message: 'This password reset token has expired. Please request a new one.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);
    const now = new Date().toISOString();

    db.run('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?', [passwordHash, now, reset.email]);
    db.run('UPDATE password_resets SET used = 1 WHERE id = ?', [reset.id]);

    res.json({
      success: true,
      message: 'Password updated successfully. You may now log in with your new credentials.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('lux_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
