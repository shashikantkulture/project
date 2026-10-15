const db = require('../../../db/database');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const totalOrders = db.get('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders');
    const totalLeads = db.get('SELECT COUNT(*) as count FROM leads');
    const qualifiedLeads = db.get("SELECT COUNT(*) as count FROM leads WHERE status IN ('Qualified', 'Negotiation', 'Won')");
    const totalCustomers = db.get('SELECT COUNT(*) as count FROM customers');
    const totalVisits = db.get('SELECT COUNT(*) as count FROM showroom_visits');

    // Stage counts
    const stages = ['New', 'Contacted', 'In Progress', 'Qualified', 'Negotiation', 'Won', 'Lost'];
    const stageCounts = {};
    for (const stage of stages) {
      const row = db.get('SELECT COUNT(*) as count FROM leads WHERE status = ?', [stage]);
      stageCounts[stage] = row.count;
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue: totalOrders.revenue,
        ordersCount: totalOrders.count,
        leadsCount: totalLeads.count,
        qualifiedCount: qualifiedLeads.count,
        customersCount: totalCustomers.count,
        visitsCount: totalVisits.count,
        conversionRate: totalLeads.count > 0 ? Math.round((totalOrders.count / totalLeads.count) * 100) : 0,
        stages: stageCounts,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: 'Failed to compute CRM stats' });
  }
}
