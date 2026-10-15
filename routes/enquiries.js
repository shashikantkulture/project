const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { optionalAuth, authenticateUser, requireStaffOrAdmin } = require('../middleware/auth');

// POST /api/enquiries — Submit public enquiry / contact form
router.post('/enquiries', optionalAuth, (req, res) => {
  try {
    const { name, email, phone, subject, message, productId, interest } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your full name, email address, and message.' });
    }

    const enquiryId = `enq-${Date.now()}`;
    const now = new Date().toISOString();
    const userId = req.user ? req.user.id : null;

    // Check if an existing lead exists with this email
    let lead = db.get('SELECT id, notes FROM leads WHERE email = ?', [email.trim().toLowerCase()]);
    let leadId = null;

    if (lead) {
      leadId = lead.id;
      // Update existing lead status and append note
      db.run(`
        UPDATE leads SET
          status = 'Contacted',
          interest = COALESCE(?, interest),
          updated_at = ?
        WHERE id = ?
      `, [subject || interest || 'Recent Enquiry Submitted', now, leadId]);

      db.run(`
        INSERT INTO lead_notes (id, lead_id, author_name, note, created_at)
        VALUES (?, ?, 'Website Form', ?, ?)
      `, [`ln-${Date.now()}`, leadId, `New enquiry: "${message.substring(0, 150)}..."`, now]);
    } else {
      // Create new lead in CRM automatically
      leadId = `lead-${Date.now()}`;
      db.run(`
        INSERT INTO leads (
          id, customer_name, email, phone, company, source, interest, budget,
          status, vastu_required, assigned_concierge, priority, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'Private Sanctuary', 'Website Contact Form', ?, '$15,000 - $35,000', 'New', 1, 'Concierge Desk', 'Medium', ?, ?, ?)
      `, [
        leadId,
        name.trim(),
        email.trim().toLowerCase(),
        phone || 'Not specified',
        subject || interest || 'Curated Artifact Enquiry',
        `Website enquiry: "${message.substring(0, 200)}"`,
        now,
        now
      ]);
    }

    // Save Enquiry
    db.run(`
      INSERT INTO enquiries (
        id, name, email, phone, subject, message, product_id, status, assigned_to, lead_id, user_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', 'Concierge Desk', ?, ?, ?, ?)
    `, [
      enquiryId,
      name.trim(),
      email.trim().toLowerCase(),
      phone || '',
      subject || 'Private Concierge Enquiry',
      message.trim(),
      productId || null,
      leadId,
      userId,
      now,
      now
    ]);

    // Create Notification for Staff & Admin
    db.run(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, NULL, 'staff', 'New Patron Enquiry Received', ?, 'enquiry', 0, '/crm#enquiries', ?)
    `, [`notif-${Date.now()}`, `Enquiry from ${name.trim()} (${email.trim()}): "${subject || 'General Inquiry'}"`, now]);

    // If submitted by logged in user, create user notification
    if (userId) {
      db.run(`
        INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
        VALUES (?, ?, 'customer', 'Enquiry Successfully Dispatched', 'Our private concierge will contact you within 24 hours.', 'enquiry', 0, '/dashboard#enquiries', ?)
      `, [`notif-user-${Date.now()}`, userId, now]);
    }

    // Log activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'ENQUIRY_SUBMITTED', 'enquiries', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, userId, name.trim(), enquiryId, `Enquiry: ${subject || 'Private Inquiry'}`, req.ip || '127.0.0.1', now]);

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. Our private curatorial desk will attend to your request promptly.',
      enquiryId
    });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({ success: false, message: 'Server error processing enquiry.' });
  }
});

// GET /api/enquiries — List enquiries
// If staff/admin: all enquiries. If customer: customer's own enquiries.
router.get('/enquiries', authenticateUser, (req, res) => {
  try {
    const isStaffOrAdmin = ['staff', 'admin', 'super_admin'].includes(req.user.role);

    let sql = 'SELECT * FROM enquiries';
    const params = [];

    if (!isStaffOrAdmin) {
      sql += ' WHERE user_id = ? OR email = ?';
      params.push(req.user.id, req.user.email);
    } else {
      const { status, search } = req.query;
      sql += ' WHERE 1=1';
      if (status && status !== 'All') {
        sql += ' AND LOWER(status) = LOWER(?)';
        params.push(status);
      }
      if (search) {
        sql += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(subject) LIKE LOWER(?) OR LOWER(message) LIKE LOWER(?))';
        const q = `%${search.trim()}%`;
        params.push(q, q, q, q);
      }
    }

    sql += ' ORDER BY created_at DESC';

    const enquiries = db.query(sql, params).map(e => {
      let product = null;
      if (e.product_id) {
        product = db.get('SELECT id, title, price, image FROM products WHERE id = ?', [e.product_id]);
      }
      return { ...e, product };
    });

    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve enquiries.' });
  }
});

// GET /api/enquiries/:id — Single Enquiry + Replies
router.get('/enquiries/:id', authenticateUser, (req, res) => {
  try {
    const enquiry = db.get('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    // Check permission: must be owner or staff/admin
    const isStaffOrAdmin = ['staff', 'admin', 'super_admin'].includes(req.user.role);
    if (!isStaffOrAdmin && enquiry.user_id !== req.user.id && enquiry.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const replies = db.query('SELECT * FROM enquiry_replies WHERE enquiry_id = ? ORDER BY created_at ASC', [enquiry.id]);
    let product = null;
    if (enquiry.product_id) {
      product = db.get('SELECT id, title, price, image, vastu FROM products WHERE id = ?', [enquiry.product_id]);
    }

    res.json({ success: true, enquiry: { ...enquiry, replies, product } });
  } catch (err) {
    console.error('Error fetching enquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve enquiry.' });
  }
});

// PUT /api/enquiries/:id — Update Enquiry Status (Staff / Admin)
router.put('/enquiries/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const { status, assigned_to } = req.body;
    const now = new Date().toISOString();

    const existing = db.get('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    db.run(`
      UPDATE enquiries SET
        status = COALESCE(?, status),
        assigned_to = COALESCE(?, assigned_to),
        updated_at = ?
      WHERE id = ?
    `, [status, assigned_to, now, req.params.id]);

    // If enquiry has a lead_id, also sync lead status
    if (existing.lead_id && status) {
      db.run('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?', [status, now, existing.lead_id]);
    }

    const updated = db.get('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, enquiry: updated });
  } catch (err) {
    console.error('Error updating enquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to update enquiry status.' });
  }
});

// POST /api/enquiries/:id/reply — Add Reply
router.post('/enquiries/:id/reply', authenticateUser, (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message content is required.' });

    const enquiry = db.get('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    const replyId = `rep-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO enquiry_replies (id, enquiry_id, sender_name, sender_role, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [replyId, req.params.id, req.user.name, req.user.role, message.trim(), now]);

    // If staff replied, update enquiry status to 'Contacted' and notify customer
    if (['staff', 'admin', 'super_admin'].includes(req.user.role)) {
      db.run("UPDATE enquiries SET status = 'Contacted', updated_at = ? WHERE id = ?", [now, req.params.id]);
      if (enquiry.user_id) {
        db.run(`
          INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
          VALUES (?, ?, 'customer', 'Curator Reply Received', ?, 'enquiry', 0, '/dashboard#enquiries', ?)
        `, [`notif-${Date.now()}`, `Concierge replied to your enquiry: "${enquiry.subject}"`, now]);
      }
    }

    res.status(201).json({
      success: true,
      reply: {
        id: replyId,
        enquiry_id: req.params.id,
        sender_name: req.user.name,
        sender_role: req.user.role,
        message: message.trim(),
        created_at: now
      }
    });
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ success: false, message: 'Failed to record reply.' });
  }
});

module.exports = router;
