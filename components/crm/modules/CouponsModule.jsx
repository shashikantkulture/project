// components/crm/modules/CouponsModule.jsx
import React, { useState } from 'react';

export default function CouponsModule({
  coupons,
  onAddCoupon
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minOrder: 200000,
    maxDiscount: 50000,
    limit: 50,
    expiry: '2026-12-31'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    onAddCoupon({
      id: `coup-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: Number(newCoupon.value),
      minOrder: Number(newCoupon.minOrder),
      maxDiscount: Number(newCoupon.maxDiscount),
      uses: 0,
      limit: Number(newCoupon.limit),
      status: 'Active',
      expiry: newCoupon.expiry
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Coupons & Curatorial Promotions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exclusive private estate tokens, first-edition incentives, and VIP discount thresholds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Create Promotion Code</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">PROMO CODE</th>
                <th className="py-3.5 px-4">DISCOUNT</th>
                <th className="py-3.5 px-4">MINIMUM ORDER</th>
                <th className="py-3.5 px-4">MAX BENEFIT</th>
                <th className="py-3.5 px-4">REDEMPTIONS</th>
                <th className="py-3.5 px-4">EXPIRY</th>
                <th className="py-3.5 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value.toLocaleString('en-IN')} OFF`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    ₹{c.minOrder.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    ₹{c.maxDiscount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                    {c.uses} / {c.limit} used
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {c.expiry}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Curatorial Promo Code</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXESTATE15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Value</label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all">Publish Token</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
