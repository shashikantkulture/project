// components/crm/modules/LeadsModule.jsx
import React, { useState, useMemo } from 'react';

export const PIPELINE_STAGES = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Interested',
  'Negotiation',
  'Payment Pending',
  'Won',
  'Lost'
];

export default function LeadsModule({
  leads,
  onUpdateLeadStage,
  onAddLead,
  onSelectLead,
  selectedLead,
  onCloseLeadDetail
}) {
  const [search, setSearch] = useState('');
  const [selectedScore, setSelectedScore] = useState('All');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    leadName: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website',
    dealValue: 500000,
    stage: 'New Lead',
    score: 'Hot',
    priority: 'VIP',
    assignedName: 'Rajesh Varma',
    notes: ''
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.leadName.toLowerCase().includes(search.toLowerCase()) ||
        l.company.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase());
      const matchScore = selectedScore === 'All' || l.score === selectedScore;
      return matchSearch && matchScore;
    });
  }, [leads, search, selectedScore]);

  // Total pipeline deal value
  const totalPipelineValue = useMemo(() => {
    return leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  }, [leads]);

  const handleCreateLead = (e) => {
    e.preventDefault();
    const newLead = {
      id: `lead-${Date.now()}`,
      leadName: newLeadForm.leadName,
      company: newLeadForm.company || 'Private Patron',
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      source: newLeadForm.source,
      dealValue: Number(newLeadForm.dealValue) || 250000,
      stage: newLeadForm.stage,
      score: newLeadForm.score,
      priority: newLeadForm.priority,
      assignedName: newLeadForm.assignedName,
      lastInteraction: 'Just now',
      nextFollowup: 'Tomorrow',
      notes: newLeadForm.notes || 'Curatorial inquiry registered.'
    };
    onAddLead(newLead);
    setShowAddLeadModal(false);
    setNewLeadForm({
      leadName: '',
      company: '',
      email: '',
      phone: '',
      source: 'Website',
      dealValue: 500000,
      stage: 'New Lead',
      score: 'Hot',
      priority: 'VIP',
      assignedName: 'Rajesh Varma',
      notes: ''
    });
  };

  const getScoreBadge = (score) => {
    switch (score) {
      case 'Hot':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50';
      case 'Warm':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50';
      default:
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Leads & Sales Pipeline Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Private client inquiries, estate commissions, and stage-by-stage deal progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">
            Pipeline: ₹{(totalPipelineValue / 100000).toFixed(1)}L Active
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Score Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            placeholder="Search lead by patron name or estate/company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Scoring:</span>
          {['All', 'Hot', 'Warm', 'Cold'].map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedScore(sc)}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                selectedScore === sc
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN BOARD COLUMNS */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);
          const stageValue = stageLeads.reduce((s, l) => s + (l.dealValue || 0), 0);

          return (
            <div
              key={stage}
              className="w-72 shrink-0 rounded-3xl bg-slate-100/70 dark:bg-slate-850 p-3.5 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stage}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold flex items-center justify-center shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  ₹{(stageValue / 100000).toFixed(1)}L
                </span>
              </div>

              {/* Cards List */}
              <div className="overflow-y-auto mt-3 space-y-3 pr-1 scrollbar-none flex-1">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-[11px] font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No inquiries in {stage}
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group space-y-2.5"
                    >
                      {/* Top row: Score badge & Deal value */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${getScoreBadge(lead.score)}`}>
                          {lead.score}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                          ₹{lead.dealValue.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Lead title & Company */}
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                          {lead.leadName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {lead.company}
                        </div>
                      </div>

                      {/* Source & Assigned Concierge */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {lead.source}
                        </span>
                        <span>{lead.assignedName}</span>
                      </div>

                      {/* Stage Mover Selector */}
                      <div
                        className="pt-1 flex items-center justify-between text-[10px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-slate-400">Move:</span>
                        <select
                          value={lead.stage}
                          onChange={(e) => onUpdateLeadStage(lead.id, e.target.value)}
                          className="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold cursor-pointer outline-none"
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEAD DETAIL DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedLead.leadName}
                    </h2>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getScoreBadge(selectedLead.score)}`}>
                      {selectedLead.score}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedLead.company}</div>
                </div>

                <button
                  onClick={onCloseLeadDetail}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Deal Specs */}
              <div className="mt-5 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Deal Value:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                    ₹{selectedLead.dealValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pipeline Stage:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {selectedLead.stage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lead Source:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedLead.source}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Concierge:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedLead.assignedName}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Contact Info</div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-300">
                  <div>Email: {selectedLead.email}</div>
                  <div>Phone: {selectedLead.phone}</div>
                </div>
              </div>

              {/* Curatorial Notes */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Inquiry Requirements</div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selectedLead.notes}
                </div>
              </div>

              {/* Stage Progression Selector */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Update Pipeline Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PIPELINE_STAGES.map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateLeadStage(selectedLead.id, st)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        selectedLead.stage === st
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onCloseLeadDetail}
                className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Curatorial Lead / Inquiry
              </h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patron / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nawabzada Zafar Ali Khan"
                  value={newLeadForm.leadName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, leadName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estate / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rampur Heritage Trusts"
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
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
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98100 00000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={newLeadForm.dealValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, dealValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Source
                  </label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Referral">Referral</option>
                    <option value="Offline Showroom">Offline Showroom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Commission requirements, Vastu notes, specific pieces..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Add Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
