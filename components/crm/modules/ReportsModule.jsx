// components/crm/modules/ReportsModule.jsx
import React, { useState } from 'react';

export default function ReportsModule({
  orders,
  customers,
  products
}) {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('MTD');
  const [format, setFormat] = useState('csv');
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerate = () => {
    let title = '';
    let rows = [];
    if (reportType === 'sales' || reportType === 'orders') {
      title = 'Luxignia Executive Acquisition & Orders Report';
      rows = (orders || []).map((o) => ({
        col1: o.orderNumber,
        col2: o.customer.name,
        col3: o.category,
        col4: `₹${o.total.toLocaleString('en-IN')}`,
        col5: o.status
      }));
    } else if (reportType === 'customer') {
      title = 'Luxignia Private Patron Intelligence & LTV Report';
      rows = (customers || []).map((c) => ({
        col1: c.name,
        col2: c.tier,
        col3: c.segment,
        col4: `₹${c.lifetimeValue.toLocaleString('en-IN')}`,
        col5: c.location
      }));
    } else {
      title = 'Luxignia Archival Inventory Valuation Report';
      rows = (products || []).map((p) => ({
        col1: p.sku,
        col2: p.title,
        col3: p.category,
        col4: `₹${p.price.toLocaleString('en-IN')}`,
        col5: `${p.stock} units`
      }));
    }

    setGeneratedReport({
      title,
      type: reportType,
      date: new Date().toLocaleDateString('en-GB'),
      rows
    });
  };

  const handleDownload = () => {
    if (!generatedReport) return;
    const header = 'Identifier,Entity/Title,Category/Tier,Valuation/Price,Status/Stock\n';
    const csvContent =
      header +
      generatedReport.rows
        .map((r) => `"${r.col1}","${r.col2}","${r.col3}","${r.col4}","${r.col5}"`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxignia_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Executive Report Builder
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate board-ready financial dossiers, GST filings, inventory audits, and patron books.
        </p>
      </div>

      {/* Configuration Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Report Subject & Dossier
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="sales">Sales & Revenue Ledger</option>
              <option value="orders">Orders & Fulfillment Log</option>
              <option value="customer">Customer LTV & Patron Cohort</option>
              <option value="inventory">Archival Inventory Valuation</option>
              <option value="tax">GST 18% Tax Ledger & Filing</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="Today">Today (Real-time)</option>
              <option value="7D">Trailing 7 Days</option>
              <option value="MTD">Month to Date (October 2026)</option>
              <option value="Q3">Q3 FY 2026-27</option>
              <option value="YTD">Year to Date (FY 2026)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Export Medium
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="csv">Comma-Separated Values (.csv)</option>
              <option value="excel">Microsoft Excel (.xlsx format)</option>
              <option value="pdf">Print-Ready Executive PDF View</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-base">analytics</span>
            <span>Generate Dossier</span>
          </button>
        </div>
      </div>

      {/* Generated Report Preview */}
      {generatedReport && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                Generated Document Preview
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {generatedReport.title}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Compiled on {generatedReport.date} • Period: {dateRange} • Luxignia Director Desk
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download {format.toUpperCase()}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Print
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5 px-4">Identifier / SKU</th>
                  <th className="py-2.5 px-4">Entity Name / Title</th>
                  <th className="py-2.5 px-4">Category / Tier</th>
                  <th className="py-2.5 px-4">Valuation / Gross</th>
                  <th className="py-2.5 px-4">Status / Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {generatedReport.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{row.col1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{row.col2}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.col3}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-mono">{row.col4}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{row.col5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
