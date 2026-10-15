/* ==========================================================================
   Luxignia — CRM & Executive Admin Panel Controller
   ========================================================================== */

class LuxigniaCRM {
  constructor() {
    this.stats = null;
    this.leads = [];
    this.orders = [];
    this.products = [];
    this.visits = [];
    this.customers = [];
    this.enquiries = [];
    this.activities = [];
    this.users = [];
    this.categories = [];
    this.contentItems = [];
    this.currentTab = 'leads';
    this.currentAdminTab = 'users';

    // Filters
    this.leadStatusFilter = 'All';
    this.leadPriorityFilter = 'All';
    this.leadSearchQuery = '';
  }

  get token() {
    return localStorage.getItem('lux_token') || '';
  }

  get authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async init() {
    await this.fetchStats();
    await this.fetchLeads();
    await this.fetchCustomers();
    await this.fetchEnquiries();
    await this.fetchOrders();
    await this.fetchProducts();
    await this.fetchVisits();
    await this.fetchActivities();
    this.renderStats();
    this.renderActiveTab();
    this.bindEvents();
  }

  async initAdmin() {
    await this.fetchUsers();
    await this.fetchCategories();
    await this.fetchContent();
    this.renderAdminTab();
    this.bindAdminEvents();
  }

  // --- DATA FETCHERS ---
  async fetchStats() {
    try {
      const res = await fetch('/api/crm/stats', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.stats = data.stats;
        this.renderStats();
      }
    } catch (err) {
      console.error("Error fetching CRM stats:", err);
    }
  }

  async fetchLeads() {
    try {
      const res = await fetch('/api/leads', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.leads = data.leads;
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  }

  async fetchCustomers() {
    try {
      const res = await fetch('/api/customers', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.customers = data.customers;
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  }

  async fetchEnquiries() {
    try {
      const res = await fetch('/api/enquiries', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.enquiries = data.enquiries;
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    }
  }

  async fetchOrders() {
    try {
      const res = await fetch('/api/orders', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.orders = data.orders;
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        this.products = data.products;
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  async fetchVisits() {
    try {
      const res = await fetch('/api/showroom-visits', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.visits = data.visits;
      }
    } catch (err) {
      console.error("Error fetching showroom visits:", err);
    }
  }

  async fetchActivities() {
    try {
      const res = await fetch('/api/activities', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.activities = data.activities;
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  }

  async fetchUsers() {
    try {
      const res = await fetch('/api/users', { headers: this.authHeaders });
      const data = await res.json();
      if (data.success) {
        this.users = data.users;
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  async fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        this.categories = data.categories;
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async fetchContent() {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        this.contentItems = data.items;
      }
    } catch (err) {
      console.error("Error fetching content items:", err);
    }
  }

  // --- STATS RENDERING ---
  renderStats() {
    if (!this.stats) return;
    const revEl = document.getElementById('crm-stat-revenue');
    const ordersEl = document.getElementById('crm-stat-orders');
    const leadsEl = document.getElementById('crm-stat-leads');
    const convEl = document.getElementById('crm-stat-conv');

    if (revEl) revEl.textContent = `$${this.stats.totalRevenue.toLocaleString()}`;
    if (ordersEl) ordersEl.textContent = this.stats.totalOrders;
    if (leadsEl) leadsEl.textContent = `${this.stats.totalLeads} (${this.stats.newLeadsCount} New)`;
    if (convEl) convEl.textContent = this.stats.conversionRate;
  }

  bindEvents() {
    document.querySelectorAll('[data-crm-tab]').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('[data-crm-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.crmTab;
        this.renderActiveTab();
      };
    });
  }

  bindAdminEvents() {
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentAdminTab = btn.dataset.adminTab;
        this.renderAdminTab();
      };
    });
  }

  renderActiveTab() {
    const container = document.getElementById('crm-tab-content');
    if (!container) return;

    switch (this.currentTab) {
      case 'leads':
        this.renderLeadsTab(container);
        break;
      case 'customers':
        this.renderCustomersTab(container);
        break;
      case 'enquiries':
        this.renderEnquiriesTab(container);
        break;
      case 'orders':
        this.renderOrdersTab(container);
        break;
      case 'products':
        this.renderProductsTab(container);
        break;
      case 'visits':
        this.renderVisitsTab(container);
        break;
      case 'activity':
        this.renderActivityTab(container);
        break;
    }
  }

  // 1. LEADS PIPELINE TAB
  renderLeadsTab(container) {
    let filtered = [...this.leads];

    if (this.leadStatusFilter !== 'All') {
      filtered = filtered.filter(l => l.status.toLowerCase() === this.leadStatusFilter.toLowerCase());
    }

    if (this.leadPriorityFilter !== 'All') {
      filtered = filtered.filter(l => (l.priority || '').toLowerCase() === this.leadPriorityFilter.toLowerCase());
    }

    if (this.leadSearchQuery) {
      const q = this.leadSearchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.customerName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.interest.toLowerCase().includes(q)
      );
    }

    let rowsHtml = filtered.map(lead => `
      <tr>
        <td>
          <div class="font-bold text-primary">${lead.customerName}</div>
          <div class="text-xs text-muted">${lead.company || 'Private Sanctuary'} • ${lead.email}</div>
          <div class="text-[10px] text-gray-400">${lead.phone} • Source: ${lead.source}</div>
        </td>
        <td>
          <div class="text-xs font-semibold text-primary">${lead.interest}</div>
          <span class="vastu-pill text-[10px] mt-1 inline-block">${lead.vastuRequired ? 'Vastu Certified' : 'Standard'}</span>
        </td>
        <td class="font-mono text-gold-bright font-bold">${lead.budget}</td>
        <td>
          <span class="priority-badge priority-${(lead.priority || 'medium').toLowerCase()}">${lead.priority || 'Medium'}</span>
        </td>
        <td>
          <select onchange="window.crmApp.updateLeadStatus('${lead.id}', this.value)" class="input-luxury text-xs py-1 px-2 font-semibold">
            <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New Lead</option>
            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Qualified" ${lead.status === 'Qualified' ? 'selected' : ''}>Qualified</option>
            <option value="Negotiation" ${lead.status === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
            <option value="Won" ${lead.status === 'Won' ? 'selected' : ''}>Won / Acquired</option>
            <option value="Lost" ${lead.status === 'Lost' ? 'selected' : ''}>Lost</option>
          </select>
          <div class="text-[10px] text-muted mt-1">Concierge: ${lead.assignedConcierge || 'Unassigned'}</div>
        </td>
        <td class="text-xs text-muted">
          <div>Follow-up: <span class="font-semibold text-primary">${lead.next_followup || 'Not scheduled'}</span></div>
          <div class="text-[10px] text-gray-400 mt-1">${new Date(lead.createdAt).toLocaleDateString()}</div>
        </td>
        <td>
          <div class="flex items-center gap-2">
            <button onclick="window.crmApp.promptAddNote('${lead.id}')" class="p-1 text-muted hover:text-gold-antique" title="Add Note">
              <span class="material-symbols-outlined text-[18px]">edit_note</span>
            </button>
            <button onclick="window.crmApp.deleteLead('${lead.id}')" class="p-1 text-muted hover:text-red-600" title="Delete Lead">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Controls Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">High-Net-Worth Lead Pipeline</h3>
            <p class="text-xs text-muted">Filter, assign concierges, track follow-ups, and move deals through qualification.</p>
          </div>
          <button onclick="document.getElementById('modal-add-lead').classList.add('active')" class="btn-primary text-xs whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Add VIP Lead</span>
          </button>
        </div>

        <!-- Filters Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-4 bg-surface-linen p-4 rounded-xl border border-subtle text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-bold text-muted uppercase">Stage:</span>
            ${['All', 'New', 'Contacted', 'Qualified', 'Negotiation', 'Won', 'Lost'].map(stage => `
              <button onclick="window.crmApp.filterLeadStatus('${stage}')" class="px-3 py-1 rounded-full font-bold ${this.leadStatusFilter === stage ? 'bg-forest-brand text-white' : 'bg-white text-muted hover:text-primary border border-subtle'}">${stage}</button>
            `).join('')}
          </div>

          <div class="flex items-center gap-3">
            <select onchange="window.crmApp.filterLeadPriority(this.value)" class="input-luxury py-1 px-2 text-xs">
              <option value="All">All Priorities</option>
              <option value="VIP">VIP</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input type="text" placeholder="Search patron / company..." oninput="window.crmApp.searchLeads(this.value)" class="input-luxury py-1 px-3 text-xs w-48">
          </div>
        </div>

        <!-- Leads Table -->
        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Patron & Contact</th>
                <th>Interest / Artifact</th>
                <th>Budget Range</th>
                <th>Priority</th>
                <th>Pipeline Stage</th>
                <th>Follow-up & Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml.length > 0 ? rowsHtml : '<tr><td colspan="7" class="text-center p-8 text-muted">No leads matching selected criteria.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  filterLeadStatus(status) {
    this.leadStatusFilter = status;
    this.renderActiveTab();
  }

  filterLeadPriority(priority) {
    this.leadPriorityFilter = priority;
    this.renderActiveTab();
  }

  searchLeads(query) {
    this.leadSearchQuery = query.trim();
    this.renderActiveTab();
  }

  async updateLeadStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PUT',
        headers: this.authHeaders,
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast(`Lead stage updated to ${newStatus}`);
        await this.fetchLeads();
        await this.fetchStats();
      }
    } catch (err) {
      console.error(err);
      window.showToast("Failed to update status.");
    }
  }

  async promptAddNote(id) {
    const note = prompt("Enter curatorial follow-up note for this patron:");
    if (!note || !note.trim()) return;

    try {
      const res = await fetch(`/api/leads/${id}/notes`, {
        method: 'POST',
        headers: this.authHeaders,
        body: JSON.stringify({ note: note.trim() })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Note recorded in lead history.");
        await this.fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async deleteLead(id) {
    if (!confirm("Are you sure you want to remove this lead from the pipeline?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: this.authHeaders
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Lead deleted from pipeline.");
        await this.fetchLeads();
        await this.fetchStats();
        this.renderActiveTab();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 2. CUSTOMER ARCHIVE TAB
  renderCustomersTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Patron Customer Directory</h3>
            <p class="text-xs text-muted">Complete database of verified buyers, VIP tiers, and lifetime acquisitions.</p>
          </div>
          <span class="text-xs font-bold text-muted">${this.customers.length} Registered Patrons</span>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Patron Name</th>
                <th>Contact Info</th>
                <th>VIP Tier</th>
                <th>Acquisitions Count</th>
                <th>Lifetime Value</th>
                <th>Estate Residence</th>
              </tr>
            </thead>
            <tbody>
              ${this.customers.map(c => `
                <tr>
                  <td>
                    <div class="font-bold text-primary">${c.fullName}</div>
                    <div class="text-[11px] text-muted">${c.company || 'Private Sanctuary'}</div>
                  </td>
                  <td class="text-xs">
                    <div>${c.email}</div>
                    <div class="text-gray-400">${c.phone}</div>
                  </td>
                  <td>
                    <span class="role-badge role-admin">${c.vipTier || 'Patron'}</span>
                  </td>
                  <td class="font-bold text-primary">${c.orderCount || 0} orders</td>
                  <td class="font-serif font-bold text-gold-bright">$${(c.totalSpent || 0).toLocaleString()}</td>
                  <td class="text-xs text-muted max-w-xs truncate">${c.address || 'Vault Address on File'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. ENQUIRY DESK TAB
  renderEnquiriesTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Website Enquiries & Inbound Messages</h3>
            <p class="text-xs text-muted">Direct inquiries dispatched from the public contact and catalog inquiry forms.</p>
          </div>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Inquiring Patron</th>
                <th>Subject & Message</th>
                <th>Status</th>
                <th>Assigned Desk</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.enquiries.map(e => `
                <tr>
                  <td>
                    <div class="font-bold text-primary">${e.name}</div>
                    <div class="text-xs text-muted">${e.email}</div>
                    <div class="text-[10px] text-gray-400">${e.phone || 'No phone'}</div>
                  </td>
                  <td>
                    <div class="font-semibold text-xs text-primary">${e.subject || 'Private Inquiry'}</div>
                    <p class="text-xs text-muted line-clamp-2 max-w-md mt-0.5">${e.message}</p>
                  </td>
                  <td>
                    <select onchange="window.crmApp.updateEnquiryStatus('${e.id}', this.value)" class="input-luxury text-xs py-1 px-2 font-semibold">
                      <option value="New" ${e.status === 'New' ? 'selected' : ''}>New</option>
                      <option value="Contacted" ${e.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                      <option value="In Progress" ${e.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                      <option value="Converted" ${e.status === 'Converted' ? 'selected' : ''}>Converted</option>
                      <option value="Closed" ${e.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                  </td>
                  <td class="text-xs text-muted">${e.assigned_to || 'Concierge'}</td>
                  <td class="text-[11px] text-muted">${new Date(e.created_at).toLocaleString()}</td>
                  <td>
                    <button onclick="window.crmApp.replyToEnquiryPrompt('${e.id}', '${e.name}')" class="btn-outline py-1 px-2.5 text-xs">
                      <span>Reply</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async updateEnquiryStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: this.authHeaders,
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast(`Enquiry updated to ${newStatus}`);
        await this.fetchEnquiries();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async replyToEnquiryPrompt(id, name) {
    const message = prompt(`Type curatorial reply to ${name}:`);
    if (!message || !message.trim()) return;

    try {
      const res = await fetch(`/api/enquiries/${id}/reply`, {
        method: 'POST',
        headers: this.authHeaders,
        body: JSON.stringify({ message: message.trim() })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Reply sent and logged.");
        await this.fetchEnquiries();
        this.renderActiveTab();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 4. ORDERS TAB
  renderOrdersTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Orders, Logistics & White-Glove Dispatch</h3>
            <p class="text-xs text-muted">Update delivery stages, courier tracking codes, and payment verifications.</p>
          </div>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Patron Details</th>
                <th>Acquired Artifacts</th>
                <th>Total Value</th>
                <th>Payment</th>
                <th>White-Glove Delivery Stage</th>
                <th>Tracking Code</th>
              </tr>
            </thead>
            <tbody>
              ${this.orders.map(o => `
                <tr>
                  <td class="font-mono font-bold text-primary">${o.orderNumber || o.order_number}</td>
                  <td>
                    <div class="font-bold">${o.patronName}</div>
                    <div class="text-xs text-muted">${o.email} • ${o.phone}</div>
                    <div class="text-[10px] text-gray-400 max-w-xs truncate">${o.address}</div>
                  </td>
                  <td>
                    <div class="text-xs font-semibold">${o.items?.map(i => `${i.qty}× ${i.title}`).join(', ') || 'Luxury Artifact'}</div>
                  </td>
                  <td class="font-serif font-bold text-primary">$${o.total.toLocaleString()}</td>
                  <td class="text-xs font-semibold text-green-700">${o.paymentStatus || o.payment_status}</td>
                  <td>
                    <select onchange="window.crmApp.updateOrderStatus('${o.id}', this.value)" class="input-luxury text-xs py-1 px-2 font-bold text-forest-brand">
                      <option value="Processing White-Glove Dispatch" ${(o.deliveryStatus || '').includes('Processing') ? 'selected' : ''}>Processing Dispatch</option>
                      <option value="White-Glove Dispatched" ${(o.deliveryStatus || '').includes('Dispatched') ? 'selected' : ''}>Dispatched En Route</option>
                      <option value="Delivered & Vastu Positioned" ${(o.deliveryStatus || '').includes('Delivered') ? 'selected' : ''}>Delivered & Positioned</option>
                    </select>
                  </td>
                  <td class="font-mono text-xs text-gold-bright font-bold">${o.trackingCode || o.tracking_code || 'LX-GLOBAL'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async updateOrderStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: this.authHeaders,
        body: JSON.stringify({ deliveryStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Delivery status updated.");
        await this.fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 5. PRODUCTS TAB
  renderProductsTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Catalog Inventory & 3D Model Registry</h3>
            <p class="text-xs text-muted">Manage stock counts, prices, Vastu directional specifications, and Three.js templates.</p>
          </div>
          <button onclick="document.getElementById('modal-add-product').classList.add('active')" class="btn-gold text-xs">
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Catalog New Artifact</span>
          </button>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Artifact</th>
                <th>Price ($)</th>
                <th>Stock</th>
                <th>Vastu Spec</th>
                <th>3D Template</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.products.map(p => `
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <img src="${p.image}" class="w-10 h-10 object-cover rounded-lg border border-gold" alt="${p.title}">
                      <div>
                        <div class="font-bold text-primary text-xs">${p.title}</div>
                        <div class="text-[10px] text-muted">${p.category} • SKU: ${p.sku || 'LUX'}</div>
                      </div>
                    </div>
                  </td>
                  <td class="font-serif font-bold text-primary">$${p.price.toLocaleString()}</td>
                  <td>
                    <input type="number" value="${p.stock}" onchange="window.crmApp.updateProductStock('${p.id}', this.value)" class="w-16 input-luxury text-xs py-1 px-2 font-bold text-center">
                  </td>
                  <td><span class="vastu-pill text-[10px]">${p.vastu}</span></td>
                  <td class="font-mono text-xs font-semibold text-muted">${p.model3d_id || p.model3dId || 'aurelius'}</td>
                  <td>
                    <button onclick="window.crmApp.deleteProduct('${p.id}')" class="text-red-600 hover:text-red-800 text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async updateProductStock(id, newStock) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: this.authHeaders,
        body: JSON.stringify({ stock: Number(newStock) })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Stock level updated.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this luxury artifact from the catalog?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: this.authHeaders
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Artifact deleted.");
        await this.fetchProducts();
        if (window.app) {
          await window.app.fetchProducts();
          window.app.renderCatalog();
        }
        this.renderActiveTab();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 6. VISITS TAB
  renderVisitsTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Private Showroom & Salon Visits</h3>
            <p class="text-xs text-muted">Patron reservations for private salon tours, directional mapping, and champagne curation.</p>
          </div>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Patron Name</th>
                <th>Showroom Gallery</th>
                <th>Date & Time Slot</th>
                <th>Special Request</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.visits.map(v => `
                <tr>
                  <td>
                    <div class="font-bold text-primary">${v.patronName}</div>
                    <div class="text-xs text-muted">${v.email} • ${v.phone}</div>
                  </td>
                  <td class="text-xs font-semibold text-primary">${v.showroom}</td>
                  <td class="text-xs">
                    <div class="font-bold text-primary">${v.visit_date}</div>
                    <div class="text-muted text-[11px]">${v.timeSlot}</div>
                  </td>
                  <td class="text-xs text-muted max-w-xs">${v.requestedService || 'Private Salon Tour'}</td>
                  <td>
                    <span class="status-pill status-won">${v.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 7. ACTIVITY LOG TAB
  renderActivityTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Audit Trail & System Activity Log</h3>
            <p class="text-xs text-muted">Chronological log of logins, checkout orders, lead creations, and catalog updates.</p>
          </div>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${this.activities.map(a => `
                <tr>
                  <td class="text-[11px] text-muted whitespace-nowrap">${new Date(a.created_at).toLocaleString()}</td>
                  <td class="font-bold text-xs text-primary">${a.user_name}</td>
                  <td><span class="role-badge role-staff text-[10px]">${a.action}</span></td>
                  <td class="text-xs font-mono text-muted">${a.entity_type}</td>
                  <td class="text-xs text-primary max-w-md">${a.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- ADMIN PANEL FUNCTIONS ---
  renderAdminTab() {
    const container = document.getElementById('admin-tab-content');
    if (!container) return;

    switch (this.currentAdminTab) {
      case 'users':
        this.renderAdminUsers(container);
        break;
      case 'categories':
        this.renderAdminCategories(container);
        break;
      case 'content':
        this.renderAdminContent(container);
        break;
      case 'system':
        this.renderAdminSystem(container);
        break;
    }
  }

  // 1. ADMIN USER MANAGEMENT
  renderAdminUsers(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">User Accounts & Role Permissions</h3>
            <p class="text-xs text-muted">Manage Super Admins, Administrators, Curators / CRM Staff, and Patrons.</p>
          </div>
          <button onclick="window.crmApp.openCreateUserModal()" class="btn-primary text-xs">
            <span class="material-symbols-outlined text-[16px]">person_add</span>
            <span>Create User Account</span>
          </button>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.users.map(u => `
                <tr>
                  <td>
                    <div class="font-bold text-primary">${u.name}</div>
                    <div class="text-xs text-muted">${u.email} • ${u.phone || 'No phone'}</div>
                  </td>
                  <td>
                    <select onchange="window.crmApp.updateUserRole('${u.id}', this.value)" class="input-luxury text-xs py-1 px-2 font-semibold">
                      <option value="super_admin" ${u.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
                      <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                      <option value="staff" ${u.role === 'staff' ? 'selected' : ''}>Staff / Curator</option>
                      <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Customer Patron</option>
                    </select>
                  </td>
                  <td>
                    <span class="status-pill ${u.status === 'active' ? 'status-won' : 'status-lost'}">${u.status}</span>
                  </td>
                  <td class="text-xs text-muted">${new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <button onclick="window.crmApp.adminResetPasswordPrompt('${u.id}')" class="text-xs text-gold-antique hover:underline font-semibold">Reset Password</button>
                      <button onclick="window.crmApp.deleteUser('${u.id}')" class="text-xs text-red-600 hover:underline font-semibold ml-2">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async updateUserRole(userId, newRole) {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: this.authHeaders,
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast(`User role updated to ${newRole}`);
        await this.fetchUsers();
      } else {
        window.showToast(data.message || 'Failed to update role.');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async adminResetPasswordPrompt(userId) {
    const newPass = prompt("Enter new password for this user (minimum 6 characters):");
    if (!newPass || newPass.length < 6) return;

    try {
      const res = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: this.authHeaders,
        body: JSON.stringify({ newPassword: newPass })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Password reset successfully.");
      } else {
        window.showToast(data.message || 'Failed to reset password.');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user account?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: this.authHeaders
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("User account deleted.");
        await this.fetchUsers();
        this.renderAdminTab();
      } else {
        window.showToast(data.message || 'Failed to delete user.');
      }
    } catch (e) {
      console.error(e);
    }
  }

  openCreateUserModal() {
    const name = prompt("User Full Name:");
    if (!name) return;
    const email = prompt("User Email Address:");
    if (!email) return;
    const password = prompt("Initial Password (min 6 characters):");
    if (!password) return;
    const role = prompt("Role (super_admin / admin / staff / customer):", "staff");

    fetch('/api/users', {
      method: 'POST',
      headers: this.authHeaders,
      body: JSON.stringify({ name, email, password, role })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.showToast("User account created successfully.");
          this.fetchUsers().then(() => this.renderAdminTab());
        } else {
          window.showToast(data.message || 'Failed to create user.');
        }
      });
  }

  // 2. ADMIN CATEGORIES
  renderAdminCategories(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Catalog Categories</h3>
            <p class="text-xs text-muted">Manage product departments and curated collections.</p>
          </div>
          <button onclick="window.crmApp.promptCreateCategory()" class="btn-primary text-xs">
            <span>Add Category</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.categories.map(c => `
            <div class="luxury-card p-6 bg-white flex flex-col justify-between">
              <div>
                <h4 class="font-serif font-bold text-lg text-primary mb-1">${c.name}</h4>
                <div class="text-xs text-muted mb-4 font-mono">slug: ${c.slug}</div>
                <p class="text-xs text-muted leading-relaxed">${c.description || 'Curated statement pieces.'}</p>
              </div>
              <div class="pt-4 border-t border-subtle mt-4 flex justify-between items-center">
                <span class="text-[11px] text-muted">Order: ${c.display_order}</span>
                <button onclick="window.crmApp.deleteCategory('${c.id}')" class="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  promptCreateCategory() {
    const name = prompt("Category Name (e.g. Bronze Masterpieces):");
    if (!name) return;
    const description = prompt("Short Description:");

    fetch('/api/categories', {
      method: 'POST',
      headers: this.authHeaders,
      body: JSON.stringify({ name, description })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.showToast("Category created.");
          this.fetchCategories().then(() => this.renderAdminTab());
        }
      });
  }

  async deleteCategory(id) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: this.authHeaders
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Category deleted.");
        await this.fetchCategories();
        this.renderAdminTab();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 3. ADMIN CONTENT CMS
  renderAdminContent(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-subtle">
          <div>
            <h3 class="font-serif font-bold text-xl text-primary">Content CMS & Editorial Management</h3>
            <p class="text-xs text-muted">Manage testimonials, FAQs, and announcement banner messages.</p>
          </div>
          <button onclick="window.crmApp.promptCreateContent()" class="btn-primary text-xs">
            <span>Add CMS Item</span>
          </button>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-subtle shadow-sm">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title / Key</th>
                <th>Content Snippet</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.contentItems.map(item => `
                <tr>
                  <td><span class="role-badge role-customer text-[10px]">${item.type}</span></td>
                  <td>
                    <div class="font-bold text-primary text-xs">${item.title || item.key}</div>
                    <div class="font-mono text-[10px] text-muted">${item.key}</div>
                  </td>
                  <td class="text-xs text-muted max-w-md line-clamp-2">${item.content}</td>
                  <td class="text-[11px] text-muted">${new Date(item.updated_at).toLocaleDateString()}</td>
                  <td>
                    <button onclick="window.crmApp.deleteContentItem('${item.id}')" class="text-xs text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  promptCreateContent() {
    const type = prompt("Content Type (testimonial / faq / announcement):", "testimonial");
    if (!type) return;
    const key = prompt("Unique Key (e.g. test-lord-sterling):");
    if (!key) return;
    const title = prompt("Title / Author Name:");
    const content = prompt("Content / Quote Text:");
    if (!content) return;

    fetch('/api/content', {
      method: 'POST',
      headers: this.authHeaders,
      body: JSON.stringify({ type, key, title, content })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.showToast("CMS item published.");
          this.fetchContent().then(() => this.renderAdminTab());
        }
      });
  }

  async deleteContentItem(id) {
    if (!confirm("Are you sure you want to remove this content item?")) return;
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
        headers: this.authHeaders
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("CMS item removed.");
        await this.fetchContent();
        this.renderAdminTab();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 4. ADMIN SYSTEM HEALTH
  renderAdminSystem(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-subtle">
          <h3 class="font-serif font-bold text-xl text-primary mb-2">System Diagnostics & Database Health</h3>
          <p class="text-xs text-muted mb-6">Database engine: SQLite WAL Mode via native Node.js DatabaseSync runtime.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-4 bg-surface-linen rounded-xl border border-subtle">
              <span class="text-xs text-muted block mb-1">Server Status</span>
              <span class="text-sm font-bold text-green-700 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-600"></span> Active & Healthy
              </span>
            </div>

            <div class="p-4 bg-surface-linen rounded-xl border border-subtle">
              <span class="text-xs text-muted block mb-1">Database Engine</span>
              <span class="text-sm font-bold text-primary">node:sqlite (WAL Mode)</span>
            </div>

            <div class="p-4 bg-surface-linen rounded-xl border border-subtle">
              <span class="text-xs text-muted block mb-1">Total Artifacts in Store</span>
              <span class="text-sm font-bold text-primary">${this.products.length} Products</span>
            </div>

            <div class="p-4 bg-surface-linen rounded-xl border border-subtle">
              <span class="text-xs text-muted block mb-1">Total Audit Records</span>
              <span class="text-sm font-bold text-primary">${this.activities.length} Recorded</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.crmApp = new LuxigniaCRM();
});
