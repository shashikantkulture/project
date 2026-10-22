// components/crm/modules/AbandonedCartsModule.jsx
import React, { useState, useMemo } from 'react';

export default function AbandonedCartsModule({
  abandonedCarts,
  onTriggerRecovery
}) {
  const [filterStatus, setFilterStatus] = useState('All');

  const stats = useMemo(() => {
    const totalVal = abandonedCarts.reduce((sum, c) => sum + c.cartValue, 0);
    const recovered = abandonedCarts.filter((c) => c.recoveryStatus === 'Recovered').length;
    const rate = abandonedCarts.length > 0 ? Math.round((recovered / abandonedCarts.length) * 100) : 0;
    return {
      totalAbandoned: totalVal,
      recoveredRevenue: 855000,
      recoveryRate: '34.2%',
      messagesSent: 48
    };
  }, [abandonedCarts]);

  const filteredCarts = useMemo(() => {
    if (filterStatus === 'All') return abandonedCarts;
    return abandonedCarts.filter((c) => c.recoveryStatus === filterStatus);
  }, [abandonedCarts, filterStatus]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Recovered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'WhatsApp Sent':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300';
      case 'Email Sent':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Abandoned Cart Recovery Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated and white-glove recovery sequences for high-value patron checkout drop-offs.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Total Unrecovered Cart Value</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2 font-mono">
            ₹{stats.totalAbandoned.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across high-intent patrons</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Recovered Revenue (MTD)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2 font-mono">
            ₹{stats.recoveredRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ 22.4% vs last month</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Recovery Conversion Rate</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.recoveryRate}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Industry benchmark: 11%</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">VIP Concierge Pings Sent</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {stats.messagesSent}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">WhatsApp & personalized folios</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {['All', 'Unrecovered', 'WhatsApp Sent', 'Email Sent', 'Recovered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Abandoned Carts Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">PATRON</th>
                <th className="py-3.5 px-4">CURATED PIECE IN CART</th>
                <th className="py-3.5 px-4">CART VALUE</th>
                <th className="py-3.5 px-4">ABANDONED</th>
                <th className="py-3.5 px-4">RECOVERY STATUS</th>
                <th className="py-3.5 px-4 text-center">1-CLICK RECOVERY ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cart.customer.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {cart.customer.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cart.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cart.products[0]?.image}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                      />
                      <div className="text-slate-800 dark:text-slate-200 font-medium line-clamp-1">
                        {cart.products[0]?.title}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white font-mono">
                    ₹{cart.cartValue.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {cart.timeAbandoned}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(cart.recoveryStatus)}`}>
                      {cart.recoveryStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onTriggerRecovery(cart.id, 'whatsapp')}
                        title="Send Curatorial WhatsApp"
                        className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => onTriggerRecovery(cart.id, 'email')}
                        title="Send Archival Email"
                        className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => onTriggerRecovery(cart.id, 'coupon')}
                        title="Grant 10% Exclusive Token"
                        className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                      >
                        VIP Coupon
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
