// components/crm/modules/MarketingModule.jsx
import React, { useState, useMemo } from 'react';

export default function MarketingModule({
  campaigns,
  onAddCampaign
}) {
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    type: 'WhatsApp',
    spend: 25000,
    reach: 1200,
    revenue: 1500000,
    date: 'Oct - Nov 2026'
  });

  const totals = useMemo(() => {
    const totalRev = campaigns.reduce((s, c) => s + c.revenue, 0);
    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
    const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0);
    const avgRoas = totalSpend > 0 ? (totalRev / totalSpend).toFixed(1) : '0';
    return {
      revenue: totalRev,
      spend: totalSpend,
      reach: totalReach,
      conversions: totalConv,
      roas: avgRoas
    };
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    if (selectedChannel === 'All') return campaigns;
    return campaigns.filter((c) => c.type === selectedChannel);
  }, [campaigns, selectedChannel]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const spend = Number(newCampaignForm.spend) || 20000;
    const rev = Number(newCampaignForm.revenue) || 1200000;
    const reach = Number(newCampaignForm.reach) || 1000;
    const clicks = Math.round(reach * 0.45);
    const conv = Math.round(clicks * 0.08);

    const newCamp = {
      id: `camp-${Date.now()}`,
      name: newCampaignForm.name,
      type: newCampaignForm.type,
      status: 'Active',
      reach,
      clicks,
      conversions: conv,
      spend,
      revenue: rev,
      roas: spend > 0 ? Number((rev / spend).toFixed(1)) : 0,
      ctr: reach > 0 ? Number(((clicks / reach) * 100).toFixed(1)) : 0,
      date: newCampaignForm.date
    };
    onAddCampaign(newCamp);
    setShowAddCampaignModal(false);
  };

  const getChannelBadge = (type) => {
    switch (type) {
      case 'WhatsApp':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'Email':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      case 'Meta Ads':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Marketing Campaigns & Curatorial ROAS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            VIP patron broadcasts, ultra-high-net-worth digital curation, and direct attribution tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddCampaignModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">campaign</span>
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Total Campaign Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            ₹{(totals.revenue / 100000).toFixed(1)} Lakh
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ 38.6% vs previous quarter</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Average Campaign ROAS</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {totals.roas}x ROAS
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Spend: ₹{(totals.spend / 1000).toFixed(0)}k</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Patron Impressions Reached</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totals.reach.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified luxury segment</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Acquisition Conversions</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {totals.conversions} Orders
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Directly attributed</div>
        </div>
      </div>

      {/* Channel Filters */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {['All', 'WhatsApp', 'Email', 'Meta Ads', 'SMS'].map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              selectedChannel === ch
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">CAMPAIGN INITIATIVE</th>
                <th className="py-3.5 px-4">CHANNEL</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">AUDIENCE REACH</th>
                <th className="py-3.5 px-4">CLICKS</th>
                <th className="py-3.5 px-4">CONVERSIONS</th>
                <th className="py-3.5 px-4">SPEND</th>
                <th className="py-3.5 px-4">REVENUE</th>
                <th className="py-3.5 px-4">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {camp.name}
                    <div className="text-[10px] text-slate-400 font-normal">{camp.date}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getChannelBadge(camp.type)}`}>
                      {camp.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {camp.reach.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {camp.clicks.toLocaleString('en-IN')} ({camp.ctr}%)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {camp.conversions} orders
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    ₹{camp.spend.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{camp.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600 font-mono">
                    {camp.roas}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Launch Curatorial Campaign
              </h3>
              <button onClick={() => setShowAddCampaignModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Solstice Foundry Collection"
                  value={newCampaignForm.name}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Channel</label>
                  <select
                    value={newCampaignForm.type}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp Business API</option>
                    <option value="Email">Email Curation Folio</option>
                    <option value="Meta Ads">Meta Ads (IG/FB)</option>
                    <option value="SMS">VIP Private SMS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={newCampaignForm.spend}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, spend: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Activate Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
