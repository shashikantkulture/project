// components/crm/modules/FinanceModule.jsx
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

export default function FinanceModule({ orders }) {
  const [activeTab, setActiveTab] = useState('transactions');

  const monthlyFinancials = [
    { month: 'May', revenue: 6800000, expenses: 3200000 },
    { month: 'Jun', revenue: 7400000, expenses: 3400000 },
    { month: 'Jul', revenue: 8900000, expenses: 3900000 },
    { month: 'Aug', revenue: 10400000, expenses: 4500000 },
    { month: 'Sep', revenue: 11200000, expenses: 4800000 },
    { month: 'Oct (MTD)', revenue: 12845000, expenses: 5120000 },
  ];

  const paymentMethodSplit = [
    { name: 'Wire Transfer / RTGS', value: 48, color: '#4F46E5' },
    { name: 'Razorpay / UPI Corp', value: 32, color: '#10B981' },
    { name: 'Amex Platinum Concierge', value: 15, color: '#F59E0B' },
    { name: 'Escrow / Security Cheque', value: 5, color: '#8B5CF6' }
  ];

  const transactions = (orders || []).map((o, idx) => ({
    id: `tx-${idx + 1}`,
    ref: `TXN-IND-${990124 + idx}`,
    orderNumber: o.orderNumber,
    customer: o.customer.name,
    amount: o.total,
    gst: o.tax,
    fee: Math.round(o.total * 0.015),
    netPayout: o.total - Math.round(o.total * 0.015),
    gateway: o.paymentMethod.split('/')[0].trim(),
    status: 'Settled',
    date: new Date(o.date).toLocaleDateString('en-GB')
  }));

  const handleExportLedger = () => {
    const headers = 'Transaction Ref,Order,Customer,Gross Amount,GST (18%),Gateway Fee,Net Payout,Gateway,Status,Date\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.ref}","${t.orderNumber}","${t.customer}","${t.amount}","${t.gst}","${t.fee}","${t.netPayout}","${t.gateway}","${t.status}","${t.date}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxignia_financial_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Finance & Gateway Reconciliation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gross revenue, net margin, GST 18% liability, and automated gateway payouts.
          </p>
        </div>

        <button
          onClick={handleExportLedger}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Export Financial Ledger</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Gross Invoiced Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            ₹1,28,45,000
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ 18.4% Month-on-Month</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Total Studio Expenses</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mt-2 font-mono">
            ₹51,20,000
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Foundry, crating, logistics</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Net Curatorial Profit</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
            ₹77,25,000
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">60.1% Net Margin</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">GST 18% Tax Ledger</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2 font-mono">
            ₹19,58,400
          </div>
          <div className="text-[11px] text-slate-400 mt-1">GSTR-1 File Ready</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue vs Expenses (Trailing 6 Months)
              </h3>
              <p className="text-[11px] text-slate-400">Gross revenue against direct foundry and studio costs</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `₹${val / 100000}L`} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" name="Expenses" fill="#E2E8F0" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Settlement Channels
            </h3>
            <p className="text-[11px] text-slate-400">Volume distribution by channel</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodSplit} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                  {paymentMethodSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Volume']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {paymentMethodSplit.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Inflow Transactions
          </h3>
          <span className="text-xs text-slate-400">Auto-reconciled with Razorpay & Axis Bank Treasury</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4">TXN REF</th>
                <th className="py-3 px-4">ORDER</th>
                <th className="py-3 px-4">PATRON</th>
                <th className="py-3 px-4">GROSS AMOUNT</th>
                <th className="py-3 px-4">GST (18%)</th>
                <th className="py-3 px-4">GATEWAY FEE</th>
                <th className="py-3 px-4">NET SETTLEMENT</th>
                <th className="py-3 px-4">GATEWAY</th>
                <th className="py-3 px-4">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {tx.ref}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {tx.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100">
                    {tx.customer}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    ₹{tx.gst.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-rose-500 font-mono">
                    -₹{tx.fee.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600 font-mono">
                    ₹{tx.netPayout.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {tx.gateway}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {tx.date}
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
