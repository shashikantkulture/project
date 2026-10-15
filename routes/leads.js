const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireStaffOrAdmin } = require('../middleware/auth');

// GET /api/leads — Search, Filter, Sort, Paginate
router.get('/leads', requireStaffOrAdmin, (req, res) => {
  try {
    const { status, source, priority, assigned, search, sort } = req.query;

    let sql = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND LOWER(status) = LOWER(?)';
      params.push(status);
    }

    if (source && source !== 'All') {
      sql += ' AND LOWER(source) = LOWER(?)';
      params.push(source);
    }

    if (priority && priority !== 'All') {
      sql += ' AND LOWER(priority) = LOWER(?)';
      params.push(priority);
    }

    if (assigned && assigned !== 'All') {
      sql += ' AND LOWER(assigned_concierge) LIKE LOWER(?)';
      params.push(`%${assigned}%`);
    }

    if (search) {
      sql += ' AND (LOWER(customer_name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(company) LIKE LOWER(?) OR LOWER(interest) LIKE LOWER(?))';
      const q = `%${search.trim()}%`;
      params.push(q, q, q, q);
    }

    // Sort
    switch (sort) {
      case 'oldest':
        sql += ' ORDER BY created_at ASC';
        break;
      case 'followup':
        sql += ' ORDER BY next_followup ASC';
        break;
      default:
        sql += ' ORDER BY created_at DESC';
    }

    const leads = db.query(sql, params).map(l => ({
      ...l,
      customerName: l.customer_name,
      assignedConcierge: l.assigned_concierge,
      vastuRequired: Boolean(l.vastu_required),
      createdAt: l.created_at,
      updatedAt: l.updated_at
    }));

    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving leads pipeline.' });
  }
});

// GET /api/leads/:id — Single Lead Detail with Notes and Follow-ups
router.get('/leads/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const lead = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found in CRM.' });

    const notes = db.query('SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC', [lead.id]);
    const followups = db.query('SELECT * FROM lead_followups WHERE lead_id = ? ORDER BY due_date ASC', [lead.id]);

    res.json({
      success: true,
      lead: {
        ...lead,
        customerName: lead.customer_name,
        assignedConcierge: lead.assigned_concierge,
        vastuRequired: Boolean(lead.vastu_required),
        notesList: notes,
        followups
      }
    });
  } catch (err) {
    console.error('Error retrieving lead:', err);
    res.status(500).json({ success: false, message: 'Error retrieving lead details.' });
  }
});

// POST /api/leads — Create Lead
router.post('/leads', requireStaffOrAdmin, (req, res) => {
  try {
    const {
      customerName, email, phone, company, source, interest,
      budget, status, vastuRequired, assignedConcierge, priority, notes, next_followup
    } = req.body;

    if (!customerName || !email) {
      return res.status(400).json({ success: false, message: 'Patron name and email address are required.' });
    }

    const id = `lead-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO leads (
        id, customer_name, email, phone, company, source, interest, budget,
        status, vastu_required, assigned_concierge, priority, notes, next_followup,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      customerName.trim(),
      email.trim(),
      phone || 'Not specified',
      company || 'Private Sanctuary',
      source || 'Staff Entry',
      interest || 'Luxury Interior Collection',
      budget || '$25,000+',
      status || 'New',
      vastuRequired ? 1 : 0,
      assignedConcierge || (req.user ? req.user.name : 'Unassigned'),
      priority || 'Medium',
      notes || 'Lead initiated by concierge.',
      next_followup || null,
      now,
      now
    ]);

    // Insert initial note if provided
    if (notes) {
      db.run(`
        INSERT INTO lead_notes (id, lead_id, author_name, note, created_at)
        VALUES (?, ?, ?, ?, ?)
      `, [`ln-${Date.now()}`, id, req.user ? req.user.name : 'Concierge', notes, now]);
    }

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'LEAD_CREATED', 'leads', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, id, `Created lead for ${customerName} (${status || 'New'})`, req.ip || '127.0.0.1', now]);

    // Create Notification for Staff
    db.run(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, NULL, 'staff', 'New High-Value Lead Added', ?, 'lead', 0, '/crm#leads', ?)
    `, [`notif-${Date.now()}`, `${customerName} was added to the CRM pipeline.`, now]);

    const created = db.get('SELECT * FROM leads WHERE id = ?', [id]);
    res.status(201).json({
      success: true,
      lead: {
        ...created,
        customerName: created.customer_name,
        assignedConcierge: created.assigned_concierge,
        vastuRequired: Boolean(created.vastu_required)
      }
    });
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ success: false, message: 'Server error creating lead.' });
  }
});

// PUT /api/leads/:id/status or PUT /api/leads/:id — Update Lead
router.put('/leads/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const existing = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Lead not found.' });

    const {
      customerName, email, phone, company, source, interest,
      budget, status, vastuRequired, assignedConcierge, priority, notes, next_followup
    } = req.body;

    const now = new Date().toISOString();

    db.run(`
      UPDATE leads SET
        customer_name = ?, email = ?, phone = ?, company = ?, source = ?,
        interest = ?, budget = ?, status = ?, vastu_required = ?,
        assigned_concierge = ?, priority = ?, notes = ?, next_followup = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      customerName !== undefined ? customerName.trim() : existing.customer_name,
      email !== undefined ? email.trim() : existing.email,
      phone !== undefined ? phone : existing.phone,
      company !== undefined ? company : existing.company,
      source !== undefined ? source : existing.source,
      interest !== undefined ? interest : existing.interest,
      budget !== undefined ? budget : existing.budget,
      status !== undefined ? status : existing.status,
      vastuRequired !== undefined ? (vastuRequired ? 1 : 0) : existing.vastu_required,
      assignedConcierge !== undefined ? assignedConcierge : existing.assigned_concierge,
      priority !== undefined ? priority : existing.priority,
      notes !== undefined ? notes : existing.notes,
      next_followup !== undefined ? next_followup : existing.next_followup,
      now,
      req.params.id
    ]);

    // If new notes provided, log as a lead_note
    if (notes && notes !== existing.notes) {
      db.run(`
        INSERT INTO lead_notes (id, lead_id, author_name, note, created_at)
        VALUES (?, ?, ?, ?, ?)
      `, [`ln-${Date.now()}`, req.params.id, req.user.name, notes, now]);
    }

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'LEAD_UPDATED', 'leads', ?, ?, ?, ?)
    `, [
      `act-${Date.now()}`,
      req.user.id,
      req.user.name,
      req.params.id,
      `Updated lead ${existing.customer_name} (Status: ${status || existing.status})`,
      req.ip || '127.0.0.1',
      now
    ]);

    const updated = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    res.json({
      success: true,
      lead: {
        ...updated,
        customerName: updated.customer_name,
        assignedConcierge: updated.assigned_concierge,
        vastuRequired: Boolean(updated.vastu_required)
      }
    });
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ success: false, message: 'Server error updating lead.' });
  }
});

// Shortcut for status update
router.put('/leads/:id/status', requireStaffOrAdmin, (req, res) => {
  try {
    const existing = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Lead not found.' });

    const { status, notes, assignedConcierge } = req.body;
    const now = new Date().toISOString();

    db.run(`
      UPDATE leads SET
        status = ?,
        notes = ?,
        assigned_concierge = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      status || existing.status,
      notes !== undefined ? notes : existing.notes,
      assignedConcierge || existing.assigned_concierge,
      now,
      req.params.id
    ]);

    if (notes) {
      db.run(`
        INSERT INTO lead_notes (id, lead_id, author_name, note, created_at)
        VALUES (?, ?, ?, ?, ?)
      `, [`ln-${Date.now()}`, req.params.id, req.user.name, notes, now]);
    }

    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'LEAD_STATUS_CHANGED', 'leads', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, req.params.id, `Status changed to ${status} for ${existing.customer_name}`, req.ip || '127.0.0.1', now]);

    const updated = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    res.json({ success: true, lead: updated });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, message: 'Failed to update lead status.' });
  }
});

// POST /api/leads/:id/notes — Add note
router.post('/leads/:id/notes', requireStaffOrAdmin, (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, message: 'Note text is required.' });

    const now = new Date().toISOString();
    const id = `ln-${Date.now()}`;

    db.run(`
      INSERT INTO lead_notes (id, lead_id, author_name, note, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, req.params.id, req.user.name, note.trim(), now]);

    res.status(201).json({ success: true, note: { id, note, author_name: req.user.name, created_at: now } });
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).json({ success: false, message: 'Failed to record note.' });
  }
});

// POST /api/leads/:id/followups — Add follow-up
router.post('/leads/:id/followups', requireStaffOrAdmin, (req, res) => {
  try {
    const { title, due_date, notes } = req.body;
    if (!title || !due_date) return res.status(400).json({ success: false, message: 'Title and due date are required.' });

    const now = new Date().toISOString();
    const id = `flw-${Date.now()}`;

    db.run(`
      INSERT INTO lead_followups (id, lead_id, title, due_date, status, notes, created_at)
      VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `, [id, req.params.id, title.trim(), due_date, notes || '', now]);

    // Also update next_followup on lead
    db.run('UPDATE leads SET next_followup = ?, updated_at = ? WHERE id = ?', [due_date, now, req.params.id]);

    res.status(201).json({ success: true, followup: { id, title, due_date, status: 'pending', notes } });
  } catch (err) {
    console.error('Error adding follow-up:', err);
    res.status(500).json({ success: false, message: 'Failed to schedule follow-up.' });
  }
});

// DELETE /api/leads/:id — Delete Lead
router.delete('/leads/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const lead = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });

    db.run('DELETE FROM leads WHERE id = ?', [req.params.id]);

    const now = new Date().toISOString();
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'LEAD_DELETED', 'leads', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, req.params.id, `Deleted lead: ${lead.customer_name}`, req.ip || '127.0.0.1', now]);

    res.json({ success: true, message: 'Lead successfully deleted from pipeline.' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ success: false, message: 'Failed to delete lead.' });
  }
});

module.exports = router;
