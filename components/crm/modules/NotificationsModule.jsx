// components/crm/modules/NotificationsModule.jsx
import React, { useState } from 'react';

export default function NotificationsModule({
  notifications,
  onMarkNotificationRead,
  onMarkAllRead,
  onNavigateTab
}) {
  const [filterType, setFilterType] = useState('All');

  const filtered = (notifications || []).filter((n) => {
    if (filterType === 'All') return true;
    return n.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Curatorial Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time acquisition alerts, low stock threshold warnings, and SLA countdown triggers.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          Mark All As Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {['All', 'Order', 'Lead', 'Inventory', 'System'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              filterType === type
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              onMarkNotificationRead(notif.id);
              if (notif.link) onNavigateTab(notif.link);
            }}
            className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
              notif.is_read
                ? 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40 opacity-75'
                : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.type === 'order'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    : notif.type === 'inventory'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {notif.type === 'order' ? 'receipt' : notif.type === 'inventory' ? 'warning' : 'info'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </span>
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-400">{notif.time || 'Today'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
