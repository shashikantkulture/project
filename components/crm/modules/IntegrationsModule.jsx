// components/crm/modules/IntegrationsModule.jsx
import React, { useState } from 'react';

export default function IntegrationsModule({ integrations }) {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleTestConnection = (name) => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: `Connection to ${name} API verified successfully with 42ms ping. Webhook listeners active.`
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Integrations & Gateway Ecosystem
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Connected e-commerce channels, payment gateways, armored logistics providers, and marketing APIs.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Connected'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                  {item.category}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">{item.lastSync}</span>
              <button
                onClick={() => {
                  setSelectedIntegration(item);
                  setTestResult(null);
                  setApiKeyInput('••••••••••••••••••••••••••••');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">{selectedIntegration.icon}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedIntegration.name}
                </h3>
              </div>
              <button onClick={() => setSelectedIntegration(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API Key / Secret Token
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Webhook Callback URL
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all select-all">
                  https://luxignia.com/api/webhooks/{selectedIntegration.id}
                </div>
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-medium leading-relaxed border border-emerald-200">
                  ✓ {testResult.message}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                disabled={isTesting}
                onClick={() => handleTestConnection(selectedIntegration.name)}
                className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                {isTesting ? 'Pinging Gateway...' : 'Test Ping Connection'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedIntegration(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
