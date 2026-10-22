// components/crm/modules/LoyaltyModule.jsx
import React from 'react';

export default function LoyaltyModule({ customers }) {
  const tiers = [
    {
      name: 'Silver Patron',
      spend: '₹50,000+',
      pointsBack: '5% Points Back',
      perks: ['Priority notification for new seasonal foundry castings', 'Complimentary archival polishing kit', 'Access to online patron vault'],
      membersCount: 142,
      accent: 'border-slate-300 bg-slate-50 dark:bg-slate-800'
    },
    {
      name: 'Gold Patron',
      spend: '₹2,50,000+',
      pointsBack: '8% Points Back',
      perks: ['Complimentary white-glove security courier', 'Exclusive invitation to annual showroom curatorial dinner', 'Bespoke silk packaging with seal'],
      membersCount: 68,
      accent: 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
    },
    {
      name: 'Platinum Patron',
      spend: '₹10,00,000+',
      pointsBack: '12% Points Back',
      perks: ['Dedicated private client concierge', 'Early preview of one-of-a-kind museum pieces', 'Custom Vastu spatial orientation audit'],
      membersCount: 24,
      accent: 'border-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
    },
    {
      name: 'Diamond Bespoke Patron',
      spend: '₹25,00,000+',
      pointsBack: '15% Points Back',
      perks: ['Private private jet atelier visits to Tuscan foundry', 'Custom bespoke casting commission privileges', 'Invitation to sovereign collector galas'],
      membersCount: 8,
      accent: 'border-cyan-400 bg-cyan-50/40 dark:bg-cyan-950/20'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Loyalty & VIP Patronage Program
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tier thresholds, lifetime reward points, and curatorial privileges for heirloom collectors.
        </p>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border ${tier.accent} shadow-sm flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {tier.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs">
                  {tier.membersCount} Patrons
                </span>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-400 font-medium">Spending Requirement</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {tier.spend}
                </div>
              </div>

              <div className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                {tier.pointsBack}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-200/60 dark:border-slate-700 pt-3 text-xs text-slate-600 dark:text-slate-300">
                {tier.perks.map((p, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors">
              Configure Tier Perks
            </button>
          </div>
        ))}
      </div>

      {/* VIP Patrons Roster */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Diamond & Platinum Patron Privileges Roster
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(customers || [])
            .filter((c) => c.tier === 'Diamond' || c.tier === 'Platinum')
            .map((cust) => (
              <div
                key={cust.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3"
              >
                <img
                  src={cust.avatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/30"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cust.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {cust.tier} Tier • LTV: ₹{(cust.lifetimeValue / 100000).toFixed(1)}L
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    {cust.ordersCount * 1250} Reward Points Active
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
