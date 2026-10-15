const db = require('../../db/database');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const customers = db.query('SELECT * FROM customers ORDER BY created_at DESC');
      return res.status(200).json({ success: true, customers });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve customers' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { id, vip_tier, notes, company, phone, address } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'Customer id is required' });

      const now = new Date().toISOString();
      db.run(
        `UPDATE customers SET
          vip_tier = COALESCE(?, vip_tier),
          notes = COALESCE(?, notes),
          company = COALESCE(?, company),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          updated_at = ?
         WHERE id = ?`,
        [vip_tier, notes, company, phone, address, now, id]
      );

      const customer = db.get('SELECT * FROM customers WHERE id = ?', [id]);
      return res.status(200).json({ success: true, customer });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to update customer' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
