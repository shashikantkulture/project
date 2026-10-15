import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function CRMPage() {
  const { user, setIsAuthModalOpen } = useApp();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'customers' | 'visits'
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCRMData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, custRes, visitsRes] = await Promise.all([
        fetch('/api/crm/stats').then((r) => r.json()),
        fetch('/api/leads').then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
        fetch('/api/showroom-visits').then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (leadsRes.success) setLeads(leadsRes.leads || []);
      if (custRes.success) setCustomers(custRes.customers || []);
      if (visitsRes.success) setVisits(visitsRes.visits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCRMData();
  }, []);

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stages = ['New', 'Contacted', 'In Progress', 'Qualified', 'Negotiation', 'Won', 'Lost'];

  const filteredLeads =
    selectedStage === 'all' ? leads : leads.filter((l) => l.status.toLowerCase() === selectedStage.toLowerCase());

  return (
    <>
      <Head>
        <title>Curatorial CRM & Lead Pipeline | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#173626]/12">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-gold">Curatorial Operations</span>
              <span className="text-[10px] text-gray-500 font-mono">LIVE DATABASE SYNC</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1C13] mt-1">
              Curatorial CRM & Advisory Suite
            </h1>
            <p className="text-xs sm:text-sm text-[#4A574F] mt-1">
              Pipeline oversight for private estate inquiries, bespoke foundry commissions, and VIP patron engagements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCRMData}
              className="btn-outline py-2 px-3 text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>Refresh Pipeline</span>
            </button>
          </div>
        </div>

        {/* EXECUTIVE KPI CARDS */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="luxury-card p-5 bg-white border border-[#C5A059]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Closed Portfolio Revenue
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1C13] mt-1">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] font-bold text-emerald-700 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>{stats.ordersCount} Authenticated Acquisitions</span>
              </div>
            </div>

            <div className="luxury-card p-5 bg-white border border-[#C5A059]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Active Patron Leads
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1C13] mt-1">
                {stats.leadsCount}
              </div>
              <div className="text-[11px] font-bold text-[#8C6A1E] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">filter_alt</span>
                <span>{stats.qualifiedCount} Qualified for Escrow</span>
              </div>
            </div>

            <div className="luxury-card p-5 bg-white border border-[#C5A059]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Showroom Consultations
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1C13] mt-1">
                {stats.visitsCount}
              </div>
              <div className="text-[11px] font-bold text-[#173626] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">meeting_room</span>
                <span>London • Mumbai • Paris</span>
              </div>
            </div>

            <div className="luxury-card p-5 bg-white border border-[#C5A059]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Patron Directory
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1C13] mt-1">
                {stats.customersCount}
              </div>
              <div className="text-[11px] font-bold text-purple-800 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                <span>Royal & Imperial Society</span>
              </div>
            </div>
          </div>
        )}

        {/* CRM SECTION TABS */}
        <div className="flex border-b border-[#173626]/12 gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'pipeline' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Leads Pipeline ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'visits' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Showroom Appointments ({visits.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'customers' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Patron Records ({customers.length})
          </button>
        </div>

        {/* TAB 1: LEADS PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Stage filter pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStage('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStage === 'all' ? 'bg-[#173626] text-white' : 'bg-white text-gray-600 border'
                }`}
              >
                All Stages ({leads.length})
              </button>
              {stages.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedStage === st ? 'bg-[#173626] text-white' : 'bg-white text-gray-600 border'
                  }`}
                >
                  {st} ({leads.filter((l) => l.status === st).length})
                </button>
              ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-[#173626]/12 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#10261C]">
                  <thead className="bg-[#F7F4EE] border-b border-[#173626]/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="py-3.5 px-4">Patron Name</th>
                      <th className="py-3.5 px-4">Interest & Scope</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Current Stage</th>
                      <th className="py-3.5 px-4">Concierge</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#173626]/8">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-serif font-bold text-sm text-[#0A1C13]">
                            {lead.customer_name}
                          </div>
                          <div className="text-[11px] text-gray-500">{lead.email} • {lead.phone}</div>
                          {lead.company && <div className="text-[10px] text-[#8C6A1E] font-semibold">{lead.company}</div>}
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-semibold text-gray-800 line-clamp-1">{lead.interest}</div>
                          <div className="text-[11px] text-gray-500 line-clamp-1">{lead.notes}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              lead.priority === 'VIP'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : lead.priority === 'High'
                                ? 'bg-red-100 text-red-900'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className="px-2 py-1 rounded bg-[#F7F4EE] border border-[#173626]/20 text-xs font-bold text-[#10261C] focus:outline-none"
                          >
                            {stages.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-700">
                          {lead.assigned_concierge || 'Unassigned'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="btn-outline py-1 px-3 text-[11px] font-bold"
                          >
                            Inspect Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHOWROOM VISITS */}
        {activeTab === 'visits' && (
          <div className="bg-white rounded-2xl border border-[#173626]/12 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#10261C]">
                <thead className="bg-[#F7F4EE] border-b border-[#173626]/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Patron Name</th>
                    <th className="py-3.5 px-4">Salon Destination</th>
                    <th className="py-3.5 px-4">Appointment Date & Slot</th>
                    <th className="py-3.5 px-4">Requested Service</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173626]/8">
                  {visits.map((vis) => (
                    <tr key={vis.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-serif font-bold text-sm text-[#0A1C13]">{vis.patron_name}</div>
                        <div className="text-[11px] text-gray-500">{vis.email} • {vis.phone}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#173626]">{vis.showroom}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold">{vis.visit_date}</div>
                        <div className="text-[11px] text-gray-500">{vis.time_slot}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{vis.requested_service}</td>
                      <td className="py-4 px-4">
                        <span className="badge-gold">{vis.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER PATRON RECORDS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-[#173626]/12 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#10261C]">
                <thead className="bg-[#F7F4EE] border-b border-[#173626]/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Patron Full Name</th>
                    <th className="py-3.5 px-4">Estate / Company</th>
                    <th className="py-3.5 px-4">VIP Tier</th>
                    <th className="py-3.5 px-4">Residence Location</th>
                    <th className="py-3.5 px-4">Curatorial Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173626]/8">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-serif font-bold text-sm text-[#0A1C13]">{c.full_name}</div>
                        <div className="text-[11px] text-gray-500">{c.email} • {c.phone}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold">{c.company || 'Private Family Trust'}</td>
                      <td className="py-4 px-4">
                        <span className="badge-gold font-bold">{c.vip_tier || 'Patron'}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{c.address || '—'}</td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs">{c.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOSSIER MODAL */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#FCF9F3] rounded-2xl max-w-lg w-full border border-[#C5A059]/40 p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <span className="badge-gold mb-1">{selectedLead.priority} Lead Dossier</span>
                  <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">{selectedLead.customer_name}</h3>
                  <div className="text-xs text-gray-500">{selectedLead.email} • {selectedLead.phone}</div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 text-gray-500 hover:text-black"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Scope of Interest:</span>
                  <p className="font-semibold text-[#10261C] mt-0.5">{selectedLead.interest}</p>
                </div>

                <div>
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Concierge Notes:</span>
                  <p className="bg-white p-3 rounded-lg border text-gray-700 mt-0.5">{selectedLead.notes || 'No confidential notes recorded.'}</p>
                </div>

                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Lead Source:</span>
                  <span className="font-bold">{selectedLead.source}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Vastu Requirement:</span>
                  <span className="font-bold text-emerald-700">{selectedLead.vastu_required ? 'Yes (Certified)' : 'Standard'}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex gap-2">
                <button
                  onClick={() => {
                    handleUpdateLeadStatus(selectedLead.id, 'Qualified');
                    setSelectedLead(null);
                  }}
                  className="btn-gold flex-1 py-2 text-xs font-bold"
                >
                  Promote to Qualified
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="btn-outline flex-1 py-2 text-xs font-bold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
