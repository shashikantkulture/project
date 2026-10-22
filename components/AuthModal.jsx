import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, handleLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = authMode === 'login' ? { email, password } : { name, email, password, phone };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        handleLogin(data.user, data.token);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: userPass }),
      });
      const data = await res.json();
      if (data.success) {
        handleLogin(data.user, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A1C13]/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#FCF9F3] rounded-2xl shadow-2xl border border-[#C5A059]/40 overflow-hidden z-10 animate-fade-in">
        {/* Top Header */}
        <div className="bg-[#173626] text-[#FCF9F3] p-6 text-center relative border-b border-[#D4AF37]/30">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-[#D8E2CB] hover:text-[#D4AF37] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-[#0A1C13] border border-[#D4AF37]/40 p-2 flex items-center justify-center shadow-md">
            <img src="/images/luxignia-logo-gold.png" alt="Luxignia" className="w-full h-full object-contain" />
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FCF9F3]">
            {authMode === 'login' ? 'Patron Vault Access' : 'Create Patron Account'}
          </h3>
          <p className="text-xs text-[#D8E2CB] mt-1">
            {authMode === 'login'
              ? 'Access private reserves, acquisitions & concierge consultations'
              : 'Join Luxignia for private viewings and bespoke commissions'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-xs font-semibold text-red-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Duchess Sophia von Rose"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Telephone (Direct)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7946 0999"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@estate.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                Secret Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm mt-2 font-bold"
            >
              {loading ? 'Authenticating...' : authMode === 'login' ? 'Unlock Patron Vault' : 'Register Account'}
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="mt-6 pt-5 border-t border-[#173626]/10 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A837C] block mb-2">
              Instant Demo Access:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patron@luxignia.com', 'Patron2026!')}
                className="px-2 py-1.5 text-[10px] font-bold rounded bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors"
              >
                VIP Patron
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('curator@luxignia.com', 'Curator2026!')}
                className="px-2 py-1.5 text-[10px] font-bold rounded bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Curator CRM
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@luxignia.com', 'LuxigniaAdmin2026!')}
                className="px-2 py-1.5 text-[10px] font-bold rounded bg-purple-50 border border-purple-300 text-purple-900 hover:bg-purple-100 transition-colors"
              >
                Super Admin
              </button>
            </div>
          </div>

          {/* Switch Login/Register */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-xs text-[#173626] font-bold hover:underline"
            >
              {authMode === 'login'
                ? "Don't have a patron account? Apply for access"
                : 'Already registered? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
