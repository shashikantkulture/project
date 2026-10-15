const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireStaffOrAdmin } = require('../middleware/auth');

// GET /api/crm/stats or /api/admin/stats
router.get('/crm/stats', requireStaffOrAdmin, (req, res) => {
  try {
    const totalRevenueRow = db.get('SELECT COALESCE(SUM(total), 0) as total FROM orders');
    const totalOrdersRow = db.get('SELECT COUNT(*) as count FROM orders');
    const totalLeadsRow = db.get('SELECT COUNT(*) as count FROM leads');
    const totalProductsRow = db.get('SELECT COUNT(*) as count FROM products');
    const totalCustomersRow = db.get('SELECT COUNT(*) as count FROM customers');
    const totalEnquiriesRow = db.get('SELECT COUNT(*) as count FROM enquiries');

    const totalRevenue = totalRevenueRow ? totalRevenueRow.total : 0;
    const totalOrders = totalOrdersRow ? totalOrdersRow.count : 0;
    const totalLeads = totalLeadsRow ? totalLeadsRow.count : 0;
    const totalProducts = totalProductsRow ? totalProductsRow.count : 0;
    const totalCustomers = totalCustomersRow ? totalCustomersRow.count : 0;
    const totalEnquiries = totalEnquiriesRow ? totalEnquiriesRow.count : 0;

    const newLeadsCount = db.get("SELECT COUNT(*) as c FROM leads WHERE status = 'New'").c;
    const activeNegotiationsCount = db.get("SELECT COUNT(*) as c FROM leads WHERE status = 'Negotiation'").c;
    const qualifiedLeadsCount = db.get("SELECT COUNT(*) as c FROM leads WHERE status = 'Qualified'").c;
    const wonDealsCount = db.get("SELECT COUNT(*) as c FROM leads WHERE status = 'Won'").c;
    const lostDealsCount = db.get("SELECT COUNT(*) as c FROM leads WHERE status = 'Lost'").c;

    const conversionRate = totalLeads > 0 ? ((wonDealsCount / totalLeads) * 100).toFixed(1) + '%' : '0%';
    const avgOrderValue = totalOrders > 0 ? '$' + Math.round(totalRevenue / totalOrders).toLocaleString() : '$0';

    // Recent activity log
    const recentActivities = db.query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 10');

    // Revenue by category
    const categoryRevenue = db.query(`
      SELECT p.category, COALESCE(SUM(oi.price * oi.qty), 0) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.category
    `);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalLeads,
        totalProducts,
        totalCustomers,
        totalEnquiries,
        newLeadsCount,
        activeNegotiationsCount,
        qualifiedLeadsCount,
        wonDealsCount,
        lostDealsCount,
        conversionRate,
        avgOrderValue,
        recentActivities,
        categoryRevenue
      }
    });
  } catch (err) {
    console.error('Error computing CRM stats:', err);
    res.status(500).json({ success: false, message: 'Server error computing dashboard metrics.' });
  }
});

// GET /api/activities — Audit Log
router.get('/activities', requireStaffOrAdmin, (req, res) => {
  try {
    const activities = db.query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 50');
    res.json({ success: true, activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve activity log.' });
  }
});

module.exports = router;
