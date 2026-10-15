import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function MembershipPage() {
  const { user, setIsAuthModalOpen } = useApp();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [selectedTier, setSelectedTier] = useState('Royal Patron');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    interests: 'Monumental Bronze Sculptures & Vastu Spatial Balancing',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill from logged in user or customer record
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      }));

      // Fetch customer details from customers API
      fetch('/api/customers')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.customers) {
            const currentCust = data.customers.find(
              (c) => c.email.toLowerCase() === user.email.toLowerCase() || c.user_id === user.id
            );
            if (currentCust) {
              setCustomerDetails(currentCust);
              if (currentCust.vip_tier) setSelectedTier(currentCust.vip_tier);
              setFormData((prev) => ({
                ...prev,
                company: currentCust.company || '',
                address: currentCust.address || prev.address,
                phone: currentCust.phone || prev.phone,
              }));
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `VIP Patron Vault Application: ${selectedTier}`,
          message: `Company/Estate: ${formData.company}\nAddress: ${formData.address}\nTier Applied: ${selectedTier}\nInterests: ${formData.interests}\nNotes: ${formData.notes}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      name: 'Patron',
      badge: 'Introductory Sanctuary',
      investment: 'By Curation',
      desc: 'Access to private showroom viewing and seasonal preview releases.',
      perks: [
        'Dedicated Private Curatorial Liaison',
        'Early 48-Hour Window on Numbered Editions',
        'Complimentary White-Glove Residential Dispatch',
        'Certificate of Directional Vastu Authenticity',
      ],
      highlight: false,
    },
    {
      name: 'Royal Patron',
      badge: 'Most Coveted Society',
      investment: 'Estate Tier',
      desc: 'Complete architectural integration and private salon access across London, Mumbai & Paris.',
      perks: [
        'All Patron Sanctuary Privileges',
        'On-Site Residential Vastu Audit by Chief Spatial Practitioner',
        'First Right of Refusal on Unique 1-of-1 Foundry Castings',
        'Invitations to Private Salon Soirées in Mayfair & Worli',
        'Priority Bespoke Commission Foundry Queue',
      ],
      highlight: true,
    },
    {
      name: 'Imperial Patron',
      badge: 'Sovereign Circle',
      investment: 'By Invitation Only',
      desc: 'The pinnacle of private collecting with bespoke armorial emblems and foundry visits.',
      perks: [
        'All Royal Patron Privileges Included',
        'Annual In-Residence Curatorial Re-Balancing & Polish',
        'Direct Access to Founder & Master Sculptor',
        'Bespoke Family Armorial / Crest lost-wax creation',
        'Private Vault Armored Storage in Switzerland',
      ],
      highlight: false,
    },
  ];

  return (
    <>
      <Head>
        <title>VIP Patron Vault | Luxignia Private Society</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#173626]/8 border border-[#C5A059]/40">
            <span className="material-symbols-outlined text-[#8C6A1E] text-base">workspace_premium</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#173626]">
              By Curatorial Invitation & Vetting
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-[#0A1C13]">
            The VIP Patron Vault
          </h1>

          <p className="text-sm sm:text-base text-[#4A574F] leading-relaxed font-medium">
            An exclusive enclave for discerning collectors, family offices, and architectural patrons seeking heirloom sculptures, mechanical horology, and sacred directional alignment.
          </p>
        </div>

        {/* Current Patron Status Banner if Logged In */}
        {user && (
          <div className="bg-[#0A1C13] rounded-3xl p-8 border-2 border-[#D4AF37]/50 shadow-xl text-[#FCF9F3] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#173626] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-2xl font-serif font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <span className="badge-gold mb-1">Active Patron Sanctuary</span>
                <h3 className="font-serif text-2xl font-bold text-[#FCF9F3]">{user.name}</h3>
                <p className="text-xs text-[#D8E2CB]">
                  Current Status: <span className="text-[#D4AF37] font-bold">{customerDetails?.vip_tier || 'Registered Patron'}</span> • ID: {user.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="text-gray-400 uppercase text-[10px] tracking-wider block">Assigned Liaison</span>
                <span className="font-serif font-bold text-[#D4AF37]">Eleanor Vance (Mayfair Desk)</span>
              </div>
              <Link href="/dashboard" className="btn-gold py-2.5 px-5 text-xs font-bold">
                Open Patron Portal
              </Link>
            </div>
          </div>
        )}

        {/* TIER BREAKDOWN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.highlight
                  ? 'bg-[#0A1C13] text-[#FCF9F3] border-2 border-[#D4AF37] shadow-2xl scale-105 z-10'
                  : 'bg-white text-[#0A1C13] border border-[#173626]/15 shadow-md hover:border-[#C5A059]'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0A1C13] text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                  Most Preferred by Estates
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                      tier.highlight ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' : 'bg-[#173626]/8 text-[#173626]'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <h3 className={`font-serif text-3xl font-bold mb-1 ${tier.highlight ? 'text-[#FCF9F3]' : 'text-[#0A1C13]'}`}>
                  {tier.name}
                </h3>

                <div className={`font-serif text-lg font-bold mb-4 ${tier.highlight ? 'text-[#D4AF37]' : 'text-[#8C6A1E]'}`}>
                  {tier.investment}
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${tier.highlight ? 'text-[#D8E2CB]' : 'text-[#4A574F]'}`}>
                  {tier.desc}
                </p>

                <div className="space-y-3 pt-4 border-t border-current/15 mb-8">
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
                    Vault Privileges:
                  </span>
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <span className={`material-symbols-outlined text-base mt-0.5 ${tier.highlight ? 'text-[#D4AF37]' : 'text-[#8C6A1E]'}`}>
                        check_circle
                      </span>
                      <span className={tier.highlight ? 'text-[#FCF9F3]' : 'text-[#2D3831]'}>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedTier(tier.name)}
                className={`w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  selectedTier === tier.name
                    ? tier.highlight
                      ? 'bg-[#D4AF37] text-[#0A1C13] font-bold shadow-lg'
                      : 'bg-[#173626] text-white font-bold'
                    : tier.highlight
                    ? 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1C13]'
                    : 'border border-[#173626] text-[#173626] hover:bg-[#173626] hover:text-white'
                }`}
              >
                {selectedTier === tier.name ? '✓ Selected for Application' : `Select ${tier.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* DETAILED APPLICATION FORM (WITH AUTO-FILLED CUSTOMER DATA) */}
        <div className="bg-[#F7F4EE] rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6A1E] block mb-1">
                Confidential Dossier
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">
                Patron Vault Application & Upgrade
              </h2>
              <p className="text-xs sm:text-sm text-[#4A574F] mt-2">
                Submissions are reviewed in confidence by the Curatorial Board within two business days.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-emerald-700">verified</span>
                <h3 className="font-serif text-2xl font-bold text-emerald-950">
                  Dossier Submitted to Curatorial Board
                </h3>
                <p className="text-xs text-emerald-900 max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name}. Your application for <span className="font-bold">{selectedTier}</span> has been received. Our Curatorial Director will reach out to schedule your private briefing.
                </p>
                <Link href="/" className="btn-primary py-2.5 px-6 text-xs font-bold inline-flex mt-2">
                  Return to Salon Homepage
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <div className="p-4 rounded-xl bg-white border border-[#173626]/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173626] uppercase tracking-wider">Applying For Status:</span>
                  <span className="badge-gold font-bold text-sm">{selectedTier}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                      Patron Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lord Alistair Sterling"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                      Confidential Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patron@estate.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                      Direct Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 20 7946 0912"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                      Estate / Family Office Entity
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Sterling Heritage Trust"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Primary Estate Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Belgravia, London or Worli Sea Face, Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Collecting Focus & Spatial Requirements
                  </label>
                  <select
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Monumental Bronze Sculptures & Vastu Spatial Balancing">Monumental Bronze Sculptures & Vastu Spatial Balancing</option>
                    <option value="Mechanical Horology & Precision Pendulum Clocks">Mechanical Horology & Precision Pendulum Clocks</option>
                    <option value="Custom Sovereign Armorial Crest Foundry Commission">Custom Sovereign Armorial Crest Foundry Commission</option>
                    <option value="Corporate Penthouse & Hospitality Spatial Installation">Corporate Penthouse & Hospitality Spatial Installation</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">shield</span>
                    <span>{loading ? 'Submitting to Board...' : `Submit Application for ${selectedTier}`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
