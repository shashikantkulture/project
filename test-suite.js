const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (options.body) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('🚀 Starting Luxignia Production Verification Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'API Health Check (/api/health)');

    // 2. Fetch products
    const productsRes = await request('/api/products');
    assert(productsRes.status === 200 && productsRes.data.products.length >= 12, `Products catalog loaded (${productsRes.data.products?.length} items)`);

    // 3. Search products
    const searchRes = await request('/api/products?search=Stallion');
    assert(searchRes.status === 200 && searchRes.data.products.length > 0, 'Catalog search by keyword');

    // 4. Filter products by category
    const filterRes = await request('/api/products?category=Clocks');
    assert(filterRes.status === 200 && filterRes.data.products.every(p => p.category.toLowerCase() === 'clocks'), 'Catalog filter by category (Clocks)');

    // 5. Test Admin Login
    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@luxignia.com', password: 'LuxigniaAdmin2026!' }
    });
    assert(adminLogin.status === 200 && adminLogin.data.token && adminLogin.data.user.role === 'super_admin', 'Admin Login credentials & token issuance');
    const adminToken = adminLogin.data.token;

    // 6. Test Staff Login
    const staffLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'curator@luxignia.com', password: 'Curator2026!' }
    });
    assert(staffLogin.status === 200 && staffLogin.data.user.role === 'staff', 'Staff Curator Login');
    const staffToken = staffLogin.data.token;

    // 7. Test Customer Registration
    const testEmail = `patron_test_${Date.now()}@domain.com`;
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Lord Testington',
        email: testEmail,
        password: 'Password123!',
        phone: '+44 20 1234 5678',
        address: '10 Kensington Palace Gardens, London'
      }
    });
    assert(regRes.status === 201 && regRes.data.token && regRes.data.user.role === 'customer', 'New Patron Registration');
    const customerToken = regRes.data.token;

    // 8. Test Role Permission Security Check
    // Customer attempting to access /api/users (Admin only)
    const custAccessAdmin = await request('/api/users', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(custAccessAdmin.status === 403, 'Security: Customer blocked from /api/users (HTTP 403)');

    // Customer attempting to access /api/leads (Staff/Admin only)
    const custAccessLeads = await request('/api/leads', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(custAccessLeads.status === 403, 'Security: Customer blocked from CRM Leads (HTTP 403)');

    // Unauthenticated accessing /api/users
    const unauthAccess = await request('/api/users');
    assert(unauthAccess.status === 401, 'Security: Unauthenticated request blocked (HTTP 401)');

    // 9. Staff accessing CRM Leads
    const staffLeads = await request('/api/leads', {
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    assert(staffLeads.status === 200 && Array.isArray(staffLeads.data.leads), 'Staff authorized to access CRM Leads pipeline');

    // 10. Public Enquiry Submission (Auto-ingests into CRM)
    const enquiryEmail = `enquiry_test_${Date.now()}@domain.com`;
    const enqRes = await request('/api/enquiries', {
      method: 'POST',
      body: {
        name: 'Countess Camilla',
        email: enquiryEmail,
        phone: '+33 1 99 88 77 66',
        subject: 'Aurelius Stallion Custom Commission',
        message: 'Requesting bespoke platinum patina on Aurelius Stallion for Parisian estate.'
      }
    });
    assert(enqRes.status === 201 && enqRes.data.success, 'Public Enquiry Submission');

    // Verify Enquiry appeared in CRM Leads
    const leadsAfterEnquiry = await request(`/api/leads?search=${enquiryEmail}`, {
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    assert(leadsAfterEnquiry.data.leads && leadsAfterEnquiry.data.leads.length > 0, 'Auto-Sync: Website enquiry successfully created CRM lead');

    // 11. Lead Status Update
    const testLead = leadsAfterEnquiry.data.leads[0];
    const updateLeadRes = await request(`/api/leads/${testLead.id}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${staffToken}` },
      body: { status: 'Negotiation', notes: 'Concierge discussed platinum patina option.' }
    });
    assert(updateLeadRes.status === 200 && updateLeadRes.data.lead.status === 'Negotiation', 'CRM Lead status update & note appending');

    // 12. Showroom Visit Booking
    const visitRes = await request('/api/showroom-visits', {
      method: 'POST',
      body: {
        patronName: 'Sir Arthur Wellesley',
        email: 'wellesley@estate.co.uk',
        phone: '+44 20 7111 2222',
        showroom: 'London Mayfair Private Vault — Berkeley Square',
        date: '2026-10-18',
        timeSlot: '14:00 - 15:30',
        requestedService: 'Private Salon Tour & Champagne Reception'
      }
    });
    assert(visitRes.status === 201 && visitRes.data.success, 'Showroom Private Visit Reservation');

    // 13. Checkout & Order Acquisition
    const orderRes = await request('/api/orders', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${customerToken}` },
      body: {
        patronName: 'Lord Testington',
        email: testEmail,
        phone: '+44 20 1234 5678',
        address: '10 Kensington Palace Gardens, London',
        paymentMethod: 'Amex Centurion / Black Card',
        items: [
          { productId: 'prod-1', qty: 1 }
        ]
      }
    });
    assert(orderRes.status === 201 && orderRes.data.order.orderNumber.startsWith('LUX-'), `Private Acquisition Checkout (${orderRes.data.order?.orderNumber})`);

    // 14. Customer Viewing Their Own Orders
    const custOrders = await request('/api/orders', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(custOrders.status === 200 && custOrders.data.orders.length === 1, 'Customer viewing personal order history in dashboard');

    // 15. Admin User Management: List Users
    const adminUsers = await request('/api/users', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminUsers.status === 200 && adminUsers.data.users.length >= 4, 'Admin User Management listing all accounts');

    // 16. CRM Analytics KPIs
    const crmStats = await request('/api/crm/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(crmStats.status === 200 && crmStats.data.stats.totalRevenue > 0, `CRM Analytics KPIs calculated (Revenue: $${crmStats.data.stats?.totalRevenue.toLocaleString()})`);

    // 17. Single Product Detail
    const singleProd = await request('/api/products/prod-1');
    assert(singleProd.status === 200 && singleProd.data.product.id === 'prod-1' && singleProd.data.related.length > 0, 'Product Detail API with related artifacts');

    // 18. Clean up: Delete test lead
    const deleteLeadRes = await request(`/api/leads/${testLead.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    assert(deleteLeadRes.status === 200, 'CRM Lead Deletion');

    console.log(`\n========================================`);
    console.log(`🏁 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal error during test suite:', err);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runTestSuite();
}

module.exports = runTestSuite;
