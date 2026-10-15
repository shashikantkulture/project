const db = require('../../db/database');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const visits = db.query('SELECT * FROM showroom_visits ORDER BY visit_date DESC');
      return res.status(200).json({ success: true, visits });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { patronName, email, phone, showroom, visitDate, timeSlot, requestedService } = req.body;
      if (!patronName || !email || !showroom) {
        return res.status(400).json({ success: false, error: 'Name, email, and salon location required' });
      }

      const id = `vis-${Date.now()}`;
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO showroom_visits (id, patron_name, email, phone, showroom, visit_date, time_slot, status, requested_service, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed Private Viewing', ?, ?)`,
        [id, patronName, email, phone || '', showroom, visitDate || now.split('T')[0], timeSlot || '14:00', requestedService || '', now]
      );

      // Create lead in pipeline
      db.run(
        `INSERT INTO leads (id, customer_name, email, phone, company, source, interest, budget, status, vastu_required, assigned_concierge, priority, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, '', 'Showroom Appointment', ?, 'VIP Consultation', 'Qualified', 1, 'Curatorial Director', 'VIP', ?, ?, ?)`,
        [
          `lead-${Date.now()}`,
          patronName,
          email,
          phone || '',
          `Showroom Booking: ${showroom} (${requestedService})`,
          `Appointment on ${visitDate} at ${timeSlot}`,
          now,
          now,
        ]
      );

      return res.status(201).json({ success: true, id, message: 'Showroom appointment reserved.' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: 'Failed to reserve appointment' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
