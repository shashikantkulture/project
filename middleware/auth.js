const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'luxignia_super_secret_jwt_key_2026_imperial_heritage';

function extractToken(req) {
  // Check Authorization header first: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Check cookie if available
  if (req.headers.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split('; ').map(c => {
        const [k, ...v] = c.split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );
    if (cookies.lux_token) return cookies.lux_token;
  }
  return null;
}

function authenticateUser(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.get('SELECT id, name, email, phone, address, role, status FROM users WHERE id = ?', [decoded.id]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found or has been revoked.' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'User account has been suspended or deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication session.' });
  }
}

function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.get('SELECT id, name, email, phone, address, role, status FROM users WHERE id = ?', [decoded.id]);
    if (user && user.status === 'active') {
      req.user = user;
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // If user is already authenticated, check role directly
    if (req.user) {
      if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not possess the required permissions for this resource.'
      });
    }

    // Otherwise authenticate first
    authenticateUser(req, res, () => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not possess the required permissions for this resource.'
      });
    });
  };
}

const requireStaffOrAdmin = requireRole('staff', 'admin', 'super_admin');
const requireAdmin = requireRole('admin', 'super_admin');
const requireSuperAdmin = requireRole('super_admin');

module.exports = {
  JWT_SECRET,
  authenticateUser,
  optionalAuth,
  requireRole,
  requireStaffOrAdmin,
  requireAdmin,
  requireSuperAdmin
};
