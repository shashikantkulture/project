// components/crm/modules/InventoryModule.jsx
import React, { useState, useMemo } from 'react';

export default function InventoryModule({
  products,
  warehouses,
  onAdjustStock
}) {
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [search, setSearch] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState(null);
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState('Foundry Delivery Received');

  // Compute metrics
  const totalUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock, 0);
  }, [products]);

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= 4).length;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [products, search]);

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (selectedProductForAdjust) {
      onAdjustStock(selectedProductForAdjust.id, Number(adjustQty), adjustReason);
      setShowAdjustModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Multi-Vault Inventory & Logistics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time stock valuation across Central Mumbai Vault, Delhi NCR Depot, and Bangalore Galleria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedProductForAdjust(products[0]);
              setShowAdjustModal(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-base">swap_horiz</span>
            <span>Adjust Vault Stock</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Total Archival Valuation</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            ₹{(totalValue / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Verified insurance backing</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Total Curated Units</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalUnits} Pieces
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 3 secure vaults</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Low Stock Thresholds</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">
            {lowStockCount} Alerts
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Under 4 units remaining</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Incoming Foundry Shipments</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            14 Works
          </div>
          <div className="text-[11px] text-slate-400 mt-1">From Tuscany & Moradabad</div>
        </div>
      </div>

      {/* Warehouse Selector & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            placeholder="Search stock by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedWarehouse('All')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              selectedWarehouse === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Vaults
          </button>
          {(warehouses || []).map((wh) => (
            <button
              key={wh.id}
              onClick={() => setSelectedWarehouse(wh.name)}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                selectedWarehouse === wh.name
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {wh.name.split(' ')[0]} {wh.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">CURATED PIECE</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">VAULT LOCATION</th>
                <th className="py-3.5 px-4">TOTAL STOCK</th>
                <th className="py-3.5 px-4">RESERVED</th>
                <th className="py-3.5 px-4">AVAILABLE</th>
                <th className="py-3.5 px-4">REORDER LEVEL</th>
                <th className="py-3.5 px-4">INCOMING</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredProducts.map((p) => {
                const reserved = Math.min(2, Math.floor(p.stock / 2));
                const available = Math.max(0, p.stock - reserved);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-400">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">
                      {p.sku}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      Mumbai Central Vault
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {p.stock}
                    </td>
                    <td className="py-3.5 px-4 text-amber-600 font-medium">
                      {reserved} (Patron Holds)
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                      {available} units
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      3 units
                    </td>
                    <td className="py-3.5 px-4 text-blue-600 dark:text-blue-400 font-medium">
                      +4 (In Transit)
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedProductForAdjust(p);
                          setShowAdjustModal(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST STOCK MODAL */}
      {showAdjustModal && selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Adjust Vault Inventory
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Masterpiece
                </label>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                  {selectedProductForAdjust.title} ({selectedProductForAdjust.sku})
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity Adjustment (positive or negative)
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adjustment Reason
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="Foundry Delivery Received">Foundry Delivery Received</option>
                  <option value="Showroom Display Allocation">Showroom Display Allocation</option>
                  <option value="VIP Private Estate Consignment">VIP Private Estate Consignment</option>
                  <option value="Foundry Recasting / Defect Return">Foundry Recasting / Defect Return</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Update Vault Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
