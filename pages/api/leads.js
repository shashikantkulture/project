const db = require('../../db/database');
const { getUserFromRequest } = require('../../lib/authHelper');

export default async function handler(req, res) {
  const user = getUserFromRequest(req);

  if (req.method === 'GET') {
    try {
      const leads = db.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.status(200).json({ success: true, leads });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve leads' });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { id, status, priority, notes, assigned_concierge } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'Lead id required' });

      const now = new Date().toISOString();
      const existing = db.get('SELECT * FROM leads WHERE id = ?', [id]);
      if (!existing) return res.status(404).json({ success: false, error: 'Lead not found' });

      db.run(
        `UPDATE leads SET
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          notes = COALESCE(?, notes),
          assigned_concierge = COALESCE(?, assigned_concierge),
          updated_at = ?
         WHERE id = ?`,
        [status, priority, notes, assigned_concierge, now, id]
      );

      const updated = db.get('SELECT * FROM leads WHERE id = ?', [id]);
      return res.status(200).json({ success: true, lead: updated });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to update lead' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
