const db = require('../../db/database');
const { getUserFromRequest } = require('../../lib/authHelper');

export default async function handler(req, res) {
  const user = getUserFromRequest(req);

  if (req.method === 'GET') {
    try {
      const enquiries = db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
      return res.status(200).json({ success: true, enquiries });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, subject, message, productId } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
      }

      const id = `enq-${Date.now()}`;
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO enquiries (id, name, email, phone, subject, message, product_id, status, assigned_to, user_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'New', 'Curatorial Concierge', ?, ?, ?)`,
        [id, name, email, phone || '', subject || 'General Curatorial Consultation', message, productId || null, user ? user.id : null, now, now]
      );

      // Create lead in CRM pipeline
      db.run(
        `INSERT INTO leads (id, customer_name, email, phone, company, source, interest, budget, status, vastu_required, assigned_concierge, priority, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, '', 'Contact Enquiry', ?, 'Variable', 'New', 1, 'Curatorial Concierge', 'Medium', ?, ?, ?)`,
        [`lead-${Date.now()}`, name, email, phone || '', subject || 'Website Enquiry', message, now, now]
      );

      return res.status(201).json({ success: true, id, message: 'Your curatorial enquiry has been received.' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: 'Failed to send enquiry' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
