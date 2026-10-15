const bcrypt = require('bcryptjs');
const db = require('../../../db/database');
const { signToken, getUserFromRequest } = require('../../../lib/authHelper');

export default async function handler(req, res) {
  const { action } = req.query;

  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    if (!user) {
      return res.status(401).json({ success: false, error: 'No account registered with this email.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Account has been deactivated.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid passcode.' });
    }

    const token = signToken(user);
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      token,
      user: safeUser,
    });
  }

  if (action === 'register') {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(400).json({ success: false, error: 'Account already registered with this email.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO users (id, name, email, password_hash, phone, address, role, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'customer', 'active', ?, ?)`,
      [userId, name.trim(), normalizedEmail, passwordHash, phone || '', address || '', now, now]
    );

    // Register customer record
    db.run(
      `INSERT INTO customers (id, user_id, full_name, email, phone, company, address, vip_tier, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, '', ?, 'Patron', 'Registered via web portal', ?, ?)`,
      [`cust-${Date.now()}`, userId, name.trim(), normalizedEmail, phone || '', address || '', now, now]
    );

    const newUser = { id: userId, name: name.trim(), email: normalizedEmail, phone, address, role: 'customer' };
    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  }

  if (action === 'me') {
    const user = getUserFromRequest(req);
    if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' });
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  }

  if (action === 'logout') {
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  return res.status(404).json({ success: false, error: 'Unknown auth action' });
}
