const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { optionalAuth, requireStaffOrAdmin } = require('../middleware/auth');

// GET /api/showroom-visits — List visits (Staff / Admin)
router.get('/showroom-visits', requireStaffOrAdmin, (req, res) => {
  try {
    const visits = db.query('SELECT * FROM showroom_visits ORDER BY visit_date DESC, created_at DESC');
    res.json({
      success: true,
      visits: visits.map(v => ({
        ...v,
        patronName: v.patron_name,
        timeSlot: v.time_slot,
        requestedService: v.requested_service
      }))
    });
  } catch (err) {
    console.error('Error fetching showroom visits:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve showroom visits.' });
  }
});

// POST /api/showroom-visits — Book Showroom Visit (Public)
router.post('/showroom-visits', optionalAuth, (req, res) => {
  try {
    const { patronName, email, phone, showroom, date, timeSlot, requestedService } = req.body;

    if (!patronName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Patron name, email, and phone number are required.' });
    }

    const visitId = `visit-${Date.now()}`;
    const now = new Date().toISOString();
    const leadId = `lead-visit-${Date.now()}`;

    // Automatically create / sync lead in CRM pipeline
    db.run(`
      INSERT INTO leads (
        id, customer_name, email, phone, company, source, interest, budget,
        status, vastu_required, assigned_concierge, priority, notes, next_followup, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'Private Appointment', 'Showroom Booking Form', ?, '$25,000+', 'New', 1, 'Concierge Desk', 'High', ?, ?, ?, ?)
    `, [
      leadId,
      patronName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      `Showroom Visit: ${showroom || 'Mumbai Flagship'}`,
      `Private visit scheduled on ${date || 'Soon'} at ${timeSlot || '14:00'}. Special Request: ${requestedService || 'Private Salon Tour & Champagne'}`,
      date || null,
      now,
      now
    ]);

    // Save Showroom Visit
    db.run(`
      INSERT INTO showroom_visits (
        id, patron_name, email, phone, showroom, visit_date, time_slot, status, requested_service, lead_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?, ?)
    `, [
      visitId,
      patronName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      showroom || 'Mumbai Flagship Gallery — Worli Sea Face',
      date || new Date().toISOString().split('T')[0],
      timeSlot || '14:00 - 15:30',
      requestedService || 'Private Salon Tour & Champagne Curation',
      leadId,
      now
    ]);

    // Notify Staff & Admin
    db.run(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, NULL, 'staff', 'New Showroom Appointment Booked', ?, 'lead', 0, '/crm#visits', ?)
    `, [`notif-${Date.now()}`, `${patronName.trim()} booked a private visit at ${showroom || 'Mumbai Flagship'} for ${date || 'upcoming'}.`, now]);

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'VISIT_BOOKED', 'showroom_visits', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user ? req.user.id : null, patronName.trim(), visitId, `Booked ${showroom || 'Salon'} visit on ${date}`, req.ip || '127.0.0.1', now]);

    const createdVisit = db.get('SELECT * FROM showroom_visits WHERE id = ?', [visitId]);
    res.status(201).json({
      success: true,
      message: 'Salon reservation confirmed. Our curatorial concierge will reach out to finalize your reception.',
      visit: createdVisit
    });
  } catch (err) {
    console.error('Error booking showroom visit:', err);
    res.status(500).json({ success: false, message: 'Server error processing showroom booking.' });
  }
});

// PUT /api/showroom-visits/:id/status — Update status (Staff / Admin)
router.put('/showroom-visits/:id/status', requireStaffOrAdmin, (req, res) => {
  try {
    const { status } = req.body;
    db.run('UPDATE showroom_visits SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Visit status updated.' });
  } catch (err) {
    console.error('Error updating visit status:', err);
    res.status(500).json({ success: false, message: 'Failed to update visit status.' });
  }
});

module.exports = router;
