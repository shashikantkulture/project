const db = require('../../../db/database');
const { getUserFromRequest } = require('../../../lib/authHelper');

export default async function handler(req, res) {
  const currentUser = getUserFromRequest(req);

  if (req.method === 'GET') {
    try {
      const users = db.query(
        'SELECT id, name, email, phone, address, role, status, created_at FROM users ORDER BY created_at DESC'
      );
      return res.status(200).json({ success: true, users });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve users' });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { id, role, status } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'User id required' });

      const now = new Date().toISOString();
      db.run(
        `UPDATE users SET
          role = COALESCE(?, role),
          status = COALESCE(?, status),
          updated_at = ?
         WHERE id = ?`,
        [role, status, now, id]
      );

      const updated = db.get('SELECT id, name, email, phone, address, role, status FROM users WHERE id = ?', [id]);
      return res.status(200).json({ success: true, user: updated });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
