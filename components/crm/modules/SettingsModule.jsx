// components/crm/modules/SettingsModule.jsx
import React, { useState } from 'react';

export default function SettingsModule({
  auditLogs,
  onSaveSettings
}) {
  const [activeTab, setActiveTab] = useState('branding');
  const [settings, setSettings] = useState({
    storeName: 'Luxignia Artisanal Studios',
    tagline: 'Heirloom Décor, Astronomical Horology & Sacred Vastu Masterpieces',
    currency: 'INR (₹)',
    gstin: '27AABCL8921P1Z4',
    taxRate: '18%',
    primaryVault: 'Mumbai Central Vault',
    supportEmail: 'directorate@luxignia.com',
    supportPhone: '+91 22 6981 4400'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          System Settings & Curatorial Audit Trail
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Brand visual identity, taxation parameters, security configurations, and forensic activity logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'branding', label: 'Store & Brand Identity' },
          { id: 'tax', label: 'Tax & GSTIN' },
          { id: 'security', label: 'Security & Supabase Cloud' },
          { id: 'audit', label: `Audit Trail Logs (${auditLogs.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      {activeTab !== 'audit' ? (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4 max-w-2xl text-xs">
          {activeTab === 'branding' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Atelier Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Curatorial Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Directorate Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Concierge Hotline</label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'tax' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GSTIN Number (Tax Registration)</label>
                <input
                  type="text"
                  value={settings.gstin}
                  onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Default GST Rate</label>
                  <input
                    type="text"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Settlement Currency</label>
                  <input
                    type="text"
                    disabled
                    value="Indian Rupee (₹ INR)"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <div className="font-bold text-blue-950 dark:text-blue-200">Supabase Cloud Architecture Status</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Local offline adapter active with 35 relational tables. To connect live Supabase cloud, configure <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in environment variables.
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Supabase DDL Schema</label>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-500">
                  db/supabase_schema.sql (Generated & Production-Ready)
                </div>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              ✓ System parameters saved successfully!
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </form>
      ) : (
        /* AUDIT LOG TABLE */
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-4">WHO (USER)</th>
                  <th className="py-3 px-4">ACTION</th>
                  <th className="py-3 px-4">MODULE</th>
                  <th className="py-3 px-4">ENTITY REF</th>
                  <th className="py-3 px-4">AUDIT EVENT DETAILS</th>
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">IP ADDRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {log.user}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-semibold">
                      {log.module}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                      {log.entityId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
