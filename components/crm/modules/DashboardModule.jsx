// components/crm/modules/DashboardModule.jsx
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardModule({
  data,
  onNavigateTab,
  onSelectOrder,
  onSelectProduct,
  onSelectCustomer,
  onTriggerRecovery
}) {
  const [dateRange, setDateRange] = useState('This month');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [widgets, setWidgets] = useState({
    recentOrders: true,
    topProducts: true,
    topCustomers: true,
    lowStock: true,
    abandonedCarts: true
  });

  // Realistic revenue comparison bar data matching reference screen 1
  const revenueChartData = [
    { day: '1 AUG', current: 1250000, previous: 980000 },
    { day: '2 AUG', current: 2200000, previous: 1450000 },
    { day: '3 AUG', current: 1100000, previous: 890000 },
    { day: '4 AUG', current: 1486700, previous: 1200000 },
    { day: '5 AUG', current: 1750000, previous: 1350000 },
    { day: '6 AUG', current: 2350000, previous: 1800000 },
    { day: '7 AUG', current: 2890000, previous: 2100000 },
    { day: '8 AUG', current: 2450000, previous: 1950000 },
  ];

  // Sales by Category Donut chart data in harmonious Blue & White palette
  const categoryData = [
    { name: 'Imperial Sculptures', value: 38, color: '#2563EB' },
    { name: 'Toroidal Ceramics', value: 24, color: '#0284C7' },
    { name: 'Vastu Masterpieces', value: 18, color: '#38BDF8' },
    { name: 'Heirloom Consoles', value: 12, color: '#60A5FA' },
    { name: 'Celestial Horology', value: 8, color: '#93C5FD' },
  ];

  const recentOrders = (data.orders || []).slice(0, 5);
  const topProducts = (data.products || []).slice(0, 4);
  const topCustomers = (data.customers || []).slice(0, 4);
  const lowStockProducts = (data.products || []).filter((p) => p.stock <= 5);
  const abandonedCarts = (data.abandonedCarts || []).slice(0, 3);

  // Status pill badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300';
      case 'Await accepting':
        return 'bg-[#FFF4ED] text-[#EA580C] dark:bg-amber-950/70 dark:text-amber-300';
      case 'On way':
        return 'bg-[#FEFCE8] text-[#CA8A04] dark:bg-yellow-950/70 dark:text-yellow-300';
      case 'Delivered':
        return 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/70 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-7 pb-12 animate-fadeIn">
      {/* 1. Header greeting & Date range filter (Matching reference top title & dropdown) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Hello, Barbara!</span>
            <span className="text-2xl animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            This is what's happening with Luxignia this month.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Personalize Dashboard button */}
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-base text-slate-400">tune</span>
            <span className="hidden sm:inline">Customize</span>
          </button>

          {/* Date range picker selector */}
          <div className="relative inline-flex items-center">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none px-4 py-2 pr-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This week">This week</option>
              <option value="This month">This month</option>
              <option value="Last month">Last month</option>
              <option value="This quarter">This quarter</option>
              <option value="This year">This year</option>
            </select>
            <span className="material-symbols-outlined text-slate-400 text-sm absolute right-3 pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-2xs">
            <span className="material-symbols-outlined text-base">calendar_month</span>
          </div>
        </div>
      </div>

      {/* 2. TOP 4 KPI CARDS (Exact recreation of reference image top card row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue (Signature Electric Royal Blue Gradient Card) */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] text-white shadow-xl shadow-blue-500/20 cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Subtle wave light effect */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">Total revenue</span>
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm">north_east</span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ₹ 1,28,45,000
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981]/25 text-emerald-200 border border-emerald-400/30 flex items-center gap-0.5">
              <span>↑</span> 18.4%
            </span>
          </div>

          <div className="mt-2 text-[11px] text-white/70 font-medium">
            This month vs last
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total orders
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">north_east</span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              184
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-0.5">
              <span>↓</span> 0.6%
            </span>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            This month vs last
          </div>
        </div>

        {/* Card 3: Total Visitors */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total visitors
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">north_east</span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              94,600
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-0.5">
              <span>↓</span> 0.8%
            </span>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            This month vs last
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Net profit
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">north_east</span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ₹ 42,80,450
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-0.5">
              <span>↑</span> 15.6%
            </span>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            This month vs last
          </div>
        </div>
      </div>

      {/* 3. TWO WIDE ACTION CARDS (Matching Reference Image Middle Row with Action Arrow) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Action Card: Orders awaiting confirmation */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] cursor-pointer group hover:border-blue-300 dark:hover:border-blue-800 transition-all flex items-center justify-between"
        >
          {/* Subtle wave line decoration watermark in Blue */}
          <div className="absolute right-12 top-0 bottom-0 opacity-10 dark:opacity-5 pointer-events-none flex items-center">
            <svg className="w-48 h-32 text-blue-600" viewBox="0 0 100 100" fill="none">
              <path d="M0 50 Q 25 20, 50 50 T 100 50" stroke="currentColor" strokeWidth="6" />
              <path d="M0 65 Q 25 35, 50 65 T 100 65" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>

          <div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <span className="material-symbols-outlined text-lg">check</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                98
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                orders
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              12 orders are <span className="font-semibold text-rose-500">awaiting confirmation</span>.
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform z-10 shrink-0">
            <span className="material-symbols-outlined text-lg">north_east</span>
          </div>
        </div>

        {/* Right Action Card: Customers waiting for response */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] cursor-pointer group hover:border-blue-300 dark:hover:border-blue-800 transition-all flex items-center justify-between"
        >
          {/* Subtle wave line decoration watermark in Blue */}
          <div className="absolute right-12 top-0 bottom-0 opacity-10 dark:opacity-5 pointer-events-none flex items-center">
            <svg className="w-48 h-32 text-blue-600" viewBox="0 0 100 100" fill="none">
              <path d="M0 40 Q 30 10, 60 40 T 100 40" stroke="currentColor" strokeWidth="6" />
              <path d="M0 55 Q 30 25, 60 55 T 100 55" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>

          <div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                17
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                customers
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              17 customers are <span className="font-semibold text-rose-500">waiting for response</span>.
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform z-10 shrink-0">
            <span className="material-symbols-outlined text-lg">north_east</span>
          </div>
        </div>
      </div>

      {/* 4. CHARTS SECTION (Recreation of Revenue Bar Chart & Sales by Category Donut Chart from Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                This month vs last
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('finance')}
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">north_east</span>
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val) => `₹${val / 100000}L`}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(37, 99, 235, 0.04)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-800">
                          <div>Day: {payload[0].payload.day}</div>
                          <div className="text-blue-400 mt-1">
                            Current: ₹{payload[0].value.toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Crisp Blue rounded bar columns */}
                <Bar
                  dataKey="current"
                  fill="#2563EB"
                  radius={[8, 8, 0, 0]}
                  barSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Sales by Category Donut Chart (1 Col) */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sales by Category
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                This month vs last
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('products')}
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">north_east</span>
            </button>
          </div>

          {/* Donut Chart with inner radius */}
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}% of total sales`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Categories</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">5 Active</span>
            </div>
          </div>

          {/* Legend Items matching reference design with dots and values */}
          <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[160px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SUPPORTING MODULES & WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Card */}
        {widgets.recentOrders && (
          <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent High-Value Orders
                </h3>
                <p className="text-[11px] text-slate-400">
                  Live orders awaiting concierge dispatch
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all orders
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-3">Order Number</th>
                    <th className="py-2.5 px-3">Patron</th>
                    <th className="py-2.5 px-3">Curated Piece</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 text-xs">
                  {recentOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => onSelectOrder(ord)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {ord.customer.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{ord.customer.email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {ord.products[0]?.title || ord.category}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Products Ranked List */}
        {widgets.topProducts && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Top Curated Masterpieces
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ranked by volume & revenue
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All
              </button>
            </div>

            <div className="space-y-3.5">
              {topProducts.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-3">
                      #{idx + 1}
                    </span>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 shadow-2xs"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.sales} units sold
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      ₹{(p.revenue / 100000).toFixed(1)}L rev
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. BOTTOM ROW: Low Stock Alert & Abandoned Carts Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        {widgets.lowStock && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Low Stock Archival Alerts
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage Vaults
              </button>
            </div>

            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-9 h-9 rounded-xl object-cover bg-slate-100"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {prod.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {prod.sku}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      Only {prod.stock} left
                    </span>
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abandoned Carts Recovery */}
        {widgets.abandonedCarts && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-lg">
                  shopping_cart_checkout
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cart Abandonment Recovery
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('abandoned-carts')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full Recovery Center
              </button>
            </div>

            <div className="space-y-3">
              {abandonedCarts.map((cart) => (
                <div
                  key={cart.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cart.customer.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {cart.customer.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cart: ₹{cart.cartValue.toLocaleString('en-IN')} • {cart.timeAbandoned}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTriggerRecovery(cart.id, 'whatsapp')}
                      title="Send VIP Concierge WhatsApp"
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => onTriggerRecovery(cart.id, 'email')}
                      title="Send Recovery Email"
                      className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Customize Dashboard Widgets
              </h3>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              {Object.keys(widgets).map((wKey) => (
                <label key={wKey} className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">
                    {wKey.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <input
                    type="checkbox"
                    checked={widgets[wKey]}
                    onChange={(e) => setWidgets({ ...widgets, [wKey]: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowCustomizeModal(false)}
              className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
            >
              Save Dashboard Layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
