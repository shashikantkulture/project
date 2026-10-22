// components/crm/modules/CustomersModule.jsx
import React, { useState, useMemo } from 'react';

export default function CustomersModule({
  customers,
  orders,
  onSelectCustomer,
  selectedCustomer,
  onCloseCustomerProfile,
  onAddCustomer,
  onUpdateCustomerNotes
}) {
  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [activeProfileTab, setActiveProfileTab] = useState('overview');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    segment: 'VIP',
    tier: 'Platinum',
    conciergeNotes: ''
  });
  const [newNoteInput, setNewNoteInput] = useState('');

  const segments = [
    'All',
    'VIP',
    'High Value',
    'Loyal',
    'New',
    'Returning',
    'At Risk',
    'Inactive',
    'Abandoned Cart',
    'Wholesale',
    'Influencer'
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchSegment = selectedSegment === 'All' || c.segment === selectedSegment;
      return matchSearch && matchSegment;
    });
  }, [customers, search, selectedSegment]);

  // Customer orders for 360 view
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.customer.id === selectedCustomer.id ||
        o.customer.email === selectedCustomer.email ||
        o.customer.name.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [orders, selectedCustomer]);

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    const newCust = {
      id: `cust-${Date.now()}`,
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone,
      location: newCustomerForm.location || 'Mumbai, MH',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      ordersCount: 1,
      lifetimeValue: 285000,
      averageOrderValue: 285000,
      lastPurchase: new Date().toISOString().slice(0, 10),
      segment: newCustomerForm.segment,
      tier: newCustomerForm.tier,
      status: 'Active',
      joinedDate: new Date().toISOString().slice(0, 10),
      preferredCategory: 'Imperial Sculptures',
      conciergeNotes: newCustomerForm.conciergeNotes || 'New patron onboarded.'
    };
    onAddCustomer(newCust);
    setShowAddCustomerModal(false);
    setNewCustomerForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      segment: 'VIP',
      tier: 'Platinum',
      conciergeNotes: ''
    });
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-gradient-to-r from-blue-900 to-blue-800 text-cyan-200 border border-cyan-400/30';
      case 'Platinum':
        return 'bg-slate-800 text-slate-100 border border-slate-600';
      case 'Gold':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Customer CRM & Patron 360°
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Private client advisory, lifetime patron engagement, and bespoke curatorial portfolios.
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Add Patron</span>
        </button>
      </div>

      {/* Toolbar: Search & Segment Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            placeholder="Search patron by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Horizontal scrollable segment pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {segments.map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSegment === seg
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800 hover:bg-blue-50/60'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">PATRON</th>
                <th className="py-3.5 px-4">LOCATION</th>
                <th className="py-3.5 px-4">VIP TIER</th>
                <th className="py-3.5 px-4">SEGMENT</th>
                <th className="py-3.5 px-4">ORDERS</th>
                <th className="py-3.5 px-4">LIFETIME VALUE</th>
                <th className="py-3.5 px-4">AOV</th>
                <th className="py-3.5 px-4">LAST ACQUISITION</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => onSelectCustomer(cust)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {cust.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cust.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {cust.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getTierBadge(cust.tier)}`}>
                      {cust.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      {cust.segment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {cust.ordersCount}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    ₹{cust.lifetimeValue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    ₹{Math.round(cust.averageOrderValue).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {cust.lastPurchase}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCustomer(cust);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      360° Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER 360° PROFILE DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCustomer.avatar}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-amber-400/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.name}
                      </h2>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getTierBadge(selectedCustomer.tier)}`}>
                        {selectedCustomer.tier} Patron
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {selectedCustomer.email} • {selectedCustomer.phone}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      📍 {selectedCustomer.location} • Joined {selectedCustomer.joinedDate}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onCloseCustomerProfile}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 4 Stats Chips */}
              <div className="grid grid-cols-4 gap-3 mt-4 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Lifetime Spent</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    ₹{(selectedCustomer.lifetimeValue / 100000).toFixed(1)}L
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Orders</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedCustomer.ordersCount}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Average Order</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    ₹{Math.round(selectedCustomer.averageOrderValue / 1000)}k
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Segment</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {selectedCustomer.segment}
                  </div>
                </div>
              </div>

              {/* 360 Tabs Navigation */}
              <div className="flex items-center gap-1 mt-5 border-b border-slate-100 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'orders', label: `Orders (${customerOrders.length})` },
                  { id: 'notes', label: 'Concierge Notes' },
                  { id: 'timeline', label: 'Activity Timeline' },
                  { id: 'marketing', label: 'Marketing' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id)}
                    className={`px-3.5 py-2 border-b-2 transition-colors whitespace-nowrap ${
                      activeProfileTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="py-4">
                {activeProfileTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                      <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">workspace_premium</span>
                        VIP Diamond Privileges Active
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Entitled to private foundry casting viewings, complimentary temperature-controlled armored logistics, and 24/7 direct access to Curatorial Directorate.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        Patron Preferences & Aesthetics
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Preferred Category:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedCustomer.preferredCategory}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Vastu Requirements:</span>
                        <span className="font-semibold text-emerald-600">
                          Always Verified with Pt. Sharma
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'orders' && (
                  <div className="space-y-2">
                    {customerOrders.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No orders recorded for this patron yet.
                      </div>
                    ) : (
                      customerOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40"
                        >
                          <div>
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                              {ord.orderNumber}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {ord.category} • {new Date(ord.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600">
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeProfileTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                      {selectedCustomer.conciergeNotes}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add curatorial advisory note..."
                        value={newNoteInput}
                        onChange={(e) => setNewNoteInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (newNoteInput.trim()) {
                            onUpdateCustomerNotes(
                              selectedCustomer.id,
                              `${selectedCustomer.conciergeNotes} | Note: ${newNoteInput.trim()}`
                            );
                            setNewNoteInput('');
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 shadow-sm shadow-blue-500/20"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'timeline' && (
                  <div className="space-y-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 ml-2 text-xs">
                    {[
                      { title: 'Inquired about custom bronze commission', time: 'Today, 10:30 AM' },
                      { title: 'Placed order #LX-89421 for Emerald Wave', time: '18 Oct 2026' },
                      { title: 'Opened VIP Diwali Private Preview', time: '14 Oct 2026' },
                      { title: 'Attended Bangalore Galleria private soirée', time: '02 Sep 2026' },
                      { title: 'Onboarded into Diamond VIP Tier', time: '12 Mar 2024' }
                    ].map((act, idx) => (
                      <div key={idx} className="relative pl-4">
                        <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{act.title}</div>
                        <div className="text-[10px] text-slate-400">{act.time}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeProfileTab === 'marketing' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">WhatsApp VIP Broadcast</div>
                        <div className="text-[10px] text-slate-400">Diwali Royal Patronage Preview</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">Engaged (Clicked)</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">Email Curation Folio</div>
                        <div className="text-[10px] text-slate-400">Curated Architectural Estates 2026</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">Opened (3 times)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={onCloseCustomerProfile}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Close 360° View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add New Luxury Patron
              </h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patron Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Princess Gayatri Devi"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="patron@estate.in"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City / State</label>
                  <input
                    type="text"
                    placeholder="Mumbai, MH"
                    value={newCustomerForm.location}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">VIP Tier</label>
                  <select
                    value={newCustomerForm.tier}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm shadow-blue-500/20"
                >
                  Save Patron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
