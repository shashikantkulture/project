const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireStaffOrAdmin } = require('../middleware/auth');

// GET /api/customers — List all customers with orders count and lifetime value
router.get('/customers', requireStaffOrAdmin, (req, res) => {
  try {
    const { search, vip_tier } = req.query;
    let sql = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (vip_tier && vip_tier !== 'All') {
      sql += ' AND LOWER(vip_tier) = LOWER(?)';
      params.push(vip_tier);
    }

    if (search) {
      sql += ' AND (LOWER(full_name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(company) LIKE LOWER(?) OR LOWER(phone) LIKE LOWER(?))';
      const q = `%${search.trim()}%`;
      params.push(q, q, q, q);
    }

    sql += ' ORDER BY created_at DESC';

    const customers = db.query(sql, params).map(c => {
      // Aggregate patron orders
      const orderStats = db.get(
        'SELECT COUNT(*) as orderCount, COALESCE(SUM(total), 0) as totalSpent FROM orders WHERE email = ?',
        [c.email]
      );
      return {
        ...c,
        fullName: c.full_name,
        vipTier: c.vip_tier,
        orderCount: orderStats ? orderStats.orderCount : 0,
        totalSpent: orderStats ? orderStats.totalSpent : 0
      };
    });

    res.json({ success: true, count: customers.length, customers });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving customer archive.' });
  }
});

// GET /api/customers/:id — Customer profile with enquiries, orders & notes
router.get('/customers/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const customer = db.get('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!customer) return res.status(404).json({ success: false, message: 'Patron not found.' });

    const orders = db.query('SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC', [customer.email]);
    const enquiries = db.query('SELECT * FROM enquiries WHERE email = ? ORDER BY created_at DESC', [customer.email]);

    res.json({
      success: true,
      customer: {
        ...customer,
        fullName: customer.full_name,
        vipTier: customer.vip_tier,
        orders,
        enquiries
      }
    });
  } catch (err) {
    console.error('Error fetching customer detail:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve patron record.' });
  }
});

// POST /api/customers — Create Customer Record
router.post('/customers', requireStaffOrAdmin, (req, res) => {
  try {
    const { fullName, email, phone, company, address, vipTier, notes } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Full name and email are required.' });
    }

    const id = `cust-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO customers (id, user_id, full_name, email, phone, company, address, vip_tier, notes, created_at, updated_at)
      VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, fullName.trim(), email.trim().toLowerCase(), phone || '', company || '', address || '', vipTier || 'Patron', notes || '', now, now]);

    const created = db.get('SELECT * FROM customers WHERE id = ?', [id]);
    res.status(201).json({ success: true, customer: created });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ success: false, message: 'Failed to create customer profile.' });
  }
});

// PUT /api/customers/:id — Update Customer Record
router.put('/customers/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const existing = db.get('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Patron not found.' });

    const { fullName, phone, company, address, vipTier, notes } = req.body;
    const now = new Date().toISOString();

    db.run(`
      UPDATE customers SET
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        company = COALESCE(?, company),
        address = COALESCE(?, address),
        vip_tier = COALESCE(?, vip_tier),
        notes = COALESCE(?, notes),
        updated_at = ?
      WHERE id = ?
    `, [fullName, phone, company, address, vipTier, notes, now, req.params.id]);

    const updated = db.get('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    res.json({ success: true, customer: updated });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ success: false, message: 'Failed to update customer profile.' });
  }
});

module.exports = router;
