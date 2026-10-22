// components/crm/CommandPalette.jsx
import React, { useState, useEffect, useMemo } from 'react';

export default function CommandPalette({ isOpen, onClose, onSelect, data }) {
  const [query, setQuery] = useState('');

  // Handle ESC and keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        modules: [
          { type: 'Navigation', label: 'Executive Dashboard', tab: 'dashboard', icon: 'dashboard' },
          { type: 'Navigation', label: 'Order Management Suite', tab: 'orders', icon: 'receipt_long' },
          { type: 'Navigation', label: 'Customer CRM 360°', tab: 'customers', icon: 'group' },
          { type: 'Navigation', label: 'Leads & Sales Kanban', tab: 'leads', icon: 'view_kanban' },
          { type: 'Navigation', label: 'Luxury Catalog & Products', tab: 'products', icon: 'inventory_2' },
          { type: 'Navigation', label: 'Multi-Warehouse Inventory', tab: 'inventory', icon: 'warehouse' },
          { type: 'Navigation', label: 'Abandoned Carts Recovery', tab: 'abandoned-carts', icon: 'shopping_cart_checkout' },
          { type: 'Navigation', label: 'Finance & GST Ledger', tab: 'finance', icon: 'account_balance' },
          { type: 'Navigation', label: 'Integrations & API Hub', tab: 'integrations', icon: 'hub' },
        ],
        orders: [],
        customers: [],
        products: [],
        leads: []
      };
    }

    const q = query.toLowerCase();

    const matchedOrders = (data.orders || [])
      .filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.category.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedCustomers = (data.customers || [])
      .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.location.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedProducts = (data.products || [])
      .filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedLeads = (data.leads || [])
      .filter((l) => l.leadName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedModules = [
      { type: 'Navigation', label: 'Executive Dashboard', tab: 'dashboard', icon: 'dashboard' },
      { type: 'Navigation', label: 'Order Management Suite', tab: 'orders', icon: 'receipt_long' },
      { type: 'Navigation', label: 'Customer CRM 360°', tab: 'customers', icon: 'group' },
      { type: 'Navigation', label: 'Leads & Sales Kanban', tab: 'leads', icon: 'view_kanban' },
      { type: 'Navigation', label: 'Luxury Catalog & Products', tab: 'products', icon: 'inventory_2' },
      { type: 'Navigation', label: 'Multi-Warehouse Inventory', tab: 'inventory', icon: 'warehouse' },
      { type: 'Navigation', label: 'Abandoned Carts Recovery', tab: 'abandoned-carts', icon: 'shopping_cart_checkout' },
      { type: 'Navigation', label: 'WhatsApp & Communications', tab: 'whatsapp', icon: 'chat' },
      { type: 'Navigation', label: 'Coupons & Promotions', tab: 'coupons', icon: 'local_offer' },
      { type: 'Navigation', label: 'Finance & GST Ledger', tab: 'finance', icon: 'account_balance' },
      { type: 'Navigation', label: 'Reports & Export Center', tab: 'reports', icon: 'summarize' },
      { type: 'Navigation', label: 'Audit Logs & Settings', tab: 'settings', icon: 'settings' },
    ].filter((m) => m.label.toLowerCase().includes(q)).slice(0, 3);

    return {
      modules: matchedModules,
      orders: matchedOrders,
      customers: matchedCustomers,
      products: matchedProducts,
      leads: matchedLeads
    };
  }, [query, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
          <input
            type="text"
            placeholder="Type a command or search orders, patrons, SKUs, leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm font-medium"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Navigation Shortcuts */}
          {results.modules.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
                Navigation & Modules
              </div>
              <div className="space-y-1">
                {results.modules.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelect('tab', m.tab);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-base">{m.icon}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                        {m.label}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-sm group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {results.orders.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
                Orders
              </div>
              <div className="space-y-1">
                {results.orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      onSelect('order', o);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md">
                        {o.orderNumber}
                      </span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        {o.customer.name}
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        • {o.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      ₹{o.total.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
                Customers / Patrons
              </div>
              <div className="space-y-1">
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelect('customer', c);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline">
                          {c.email}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                      {c.tier} Tier
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
                Luxury Catalog Items
              </div>
              <div className="space-y-1">
                {results.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelect('product', p);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-7 h-7 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {p.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {results.leads.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
                Active Inquiries & Leads
              </div>
              <div className="space-y-1">
                {results.leads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelect('lead', l);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {l.leadName}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({l.company})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
                        {l.stage}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        ₹{l.dealValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">↵</kbd> to select
            </span>
          </div>
          <span>Luxignia Global Command</span>
        </div>
      </div>
    </div>
  );
}
