// components/crm/modules/AnalyticsModule.jsx
import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AnalyticsModule() {
  const [activeTab, setActiveTab] = useState('sales');

  const customerGrowthData = [
    { month: 'Jan', newPatrons: 18, returning: 12 },
    { month: 'Feb', newPatrons: 24, returning: 16 },
    { month: 'Mar', newPatrons: 32, returning: 22 },
    { month: 'Apr', newPatrons: 45, returning: 28 },
    { month: 'May', newPatrons: 52, returning: 35 },
    { month: 'Jun', newPatrons: 68, returning: 44 },
    { month: 'Jul', newPatrons: 82, returning: 56 },
    { month: 'Aug', newPatrons: 98, returning: 65 },
    { month: 'Sep', newPatrons: 110, returning: 78 },
    { month: 'Oct', newPatrons: 128, returning: 92 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Executive Analytics & Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deep-dive patron economics, cohort retention, acquisition costs (CAC), and inventory velocity.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'sales', label: 'Sales Intelligence' },
          { id: 'patron', label: 'Patron Economics (LTV / CAC)' },
          { id: 'velocity', label: 'Curatorial Velocity' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Customer Acquisition Cost (CAC)</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            ₹18,450
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">LTV:CAC Ratio: 18.6x</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Patron Lifetime Value (LTV)</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            ₹3,42,800
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Average 4.2 repeat orders</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">90-Day Patron Retention Rate</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
            78.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Churn rate: 3.2%</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Annual Inventory Velocity</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2 font-mono">
            4.8x Turns
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Average dwell time: 76 days</div>
        </div>
      </div>

      {/* Big Customer Growth Area Chart */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Patron Growth & Cohort Retention (2026 MTD)
            </h3>
            <p className="text-[11px] text-slate-400">
              New estate inquiries vs repeat collectors acquiring additional works
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }} />
              <Area type="monotone" dataKey="newPatrons" name="New Patrons" stroke="#2563EB" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="returning" name="Repeat Collectors" stroke="#10B981" fillOpacity={1} fill="url(#colorRet)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
