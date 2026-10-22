// components/crm/CRMTopbar.jsx
import React, { useState } from 'react';

export default function CRMTopbar({
  onOpenCommandPalette,
  dateRange,
  onChangeDateRange,
  notifications,
  onMarkNotificationRead,
  darkMode,
  onToggleDarkMode,
  onQuickAdd,
  onSelectTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100/90 dark:border-slate-800/90 px-6 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Global Search Pill Bar (Inspired directly by the reference image search pill) */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
              <span className="material-symbols-outlined text-lg">search</span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-400">
                Search patrons, orders, SKUs, tickets...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 shadow-2xs">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-3">
          {/* Date Indicator Pill (Inspired directly by "Today, Mon 22 Nov" in reference image) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>Today, Mon 18 Oct</span>
          </div>

          {/* Quick-Add Button (+ New) */}
          <div className="relative">
            <button
              onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span className="hidden sm:inline">Create</span>
            </button>

            {showQuickAddMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fadeIn"
                onClick={() => setShowQuickAddMenu(false)}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">
                  Quick Actions
                </div>
                <button
                  onClick={() => onQuickAdd('order')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base text-blue-600">receipt_long</span>
                  <span>New Order</span>
                </button>
                <button
                  onClick={() => onQuickAdd('customer')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base text-amber-600">person_add</span>
                  <span>Add Patron</span>
                </button>
                <button
                  onClick={() => onQuickAdd('lead')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base text-emerald-600">contact_mail</span>
                  <span>New Lead</span>
                </button>
                <button
                  onClick={() => onQuickAdd('product')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base text-blue-600">inventory_2</span>
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => onQuickAdd('campaign')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base text-rose-600">campaign</span>
                  <span>Launch Campaign</span>
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Bell (Matching reference top-right bell icon) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      (notifications || []).forEach((n) => onMarkNotificationRead(n.id));
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto py-2 space-y-2">
                  {(notifications || []).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                        notif.is_read
                          ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-70'
                          : 'bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notif.time || 'Today'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('notifications');
                  }}
                  className="w-full mt-2 py-2 text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors border-t border-slate-100 dark:border-slate-800"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>

          {/* User Profile Pill Avatar (Matching reference top-right avatar) */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
              />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-fadeIn"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Rajesh Varma
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    rajesh.varma@luxignia.com
                  </div>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                    Super Admin
                  </span>
                </div>

                <div className="pt-2 space-y-1">
                  <button
                    onClick={() => onSelectTab('settings')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-base text-slate-400">settings</span>
                    <span>System Settings</span>
                  </button>
                  <button
                    onClick={() => onSelectTab('team')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-base text-slate-400">badge</span>
                    <span>Team & Roles</span>
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') window.location.href = '/';
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Exit to Storefront</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
