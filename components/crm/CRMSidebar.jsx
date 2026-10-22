// components/crm/CRMSidebar.jsx
import React from 'react';

export const NAV_ITEMS = [
  {
    group: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'orders', label: 'Orders', icon: 'receipt_long', badge: '12' },
      { id: 'customers', label: 'Customers', icon: 'group' },
      { id: 'products', label: 'Products', icon: 'inventory_2' },
      { id: 'inventory', label: 'Inventory', icon: 'warehouse', badge: '3' },
      { id: 'leads', label: 'Sales Pipeline', icon: 'view_kanban', badge: '8' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    ]
  },
  {
    group: 'COMMERCE',
    items: [
      { id: 'returns', label: 'Returns & Refunds', icon: 'assignment_return' },
      { id: 'coupons', label: 'Coupons & Promos', icon: 'local_offer' },
    ]
  },
  {
    group: 'CUSTOMER EXPERIENCE',
    items: [
      { id: 'loyalty', label: 'Loyalty & VIP', icon: 'workspace_premium' },
      { id: 'reviews', label: 'Reviews', icon: 'star' },
      { id: 'support', label: 'Support Tickets', icon: 'support_agent', badge: '3' },
    ]
  },
  {
    group: 'MARKETING',
    items: [
      { id: 'campaigns', label: 'Campaigns', icon: 'campaign' },
      { id: 'whatsapp', label: 'WhatsApp Inbox', icon: 'chat', badge: '1' },
      { id: 'abandoned-carts', label: 'Abandoned Carts', icon: 'shopping_cart_checkout', badge: '3' },
    ]
  },
  {
    group: 'BUSINESS',
    items: [
      { id: 'finance', label: 'Finance & GST', icon: 'account_balance' },
      { id: 'reports', label: 'Report Builder', icon: 'summarize' },
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: '4' },
      { id: 'team', label: 'Team & RBAC', icon: 'badge' },
      { id: 'integrations', label: 'Integrations Hub', icon: 'hub' },
      { id: 'settings', label: 'Settings & Audit', icon: 'settings' },
    ]
  }
];

export default function CRMSidebar({ activeTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100/80 dark:border-slate-800/80">
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Luxignia Modern Emblem in Crisp Electric Blue */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 9 9" />
                <path d="M12 7a5 5 0 0 1 5 5" />
                <path d="M12 11a1 1 0 0 1 1 1" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <div className="font-serif font-bold text-sm tracking-widest text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                  LUXIGNIA
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-sans font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Curatorial Operating System
                </div>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle Button (matching » icon in reference top-left) */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            className="w-7 h-7 rounded-xl bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-base transition-transform duration-200">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Navigation List */}
        <div className="overflow-y-auto max-h-[calc(100vh-140px)] px-3 py-4 space-y-6 scrollbar-thin">
          {NAV_ITEMS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed ? (
                <div className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 py-1">
                  {group.group}
                </div>
              ) : (
                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />
              )}

              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between rounded-2xl transition-all duration-200 group relative ${
                      isCollapsed
                        ? 'p-2.5 justify-center'
                        : 'px-3 py-2 text-left'
                    } ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 hover:text-blue-700 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </span>

                      {!isCollapsed && (
                        <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Small badge dot in collapsed mode */}
                    {isCollapsed && item.badge && !isActive && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / User Profile & Signout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div
          className={`flex items-center justify-between ${
            isCollapsed ? 'flex-col gap-2' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                alt="Rajesh Varma"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/30"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  Rajesh Varma
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  Super Admin
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
            title="Exit to Storefront"
            className="w-8 h-8 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
