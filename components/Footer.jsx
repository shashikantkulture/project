import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#0A1C13] text-[#FCF9F3] border-t-2 border-[#D4AF37]/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#FCF9F3]/15">
          {/* Column 1: Brand & Atelier */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D4AF37] text-3xl">spa</span>
              <span className="font-serif text-3xl font-bold tracking-tight text-[#FCF9F3]">Luxignia</span>
            </div>
            <p className="text-xs text-[#E5E2DC] leading-relaxed max-w-sm">
              Artisanal luxury statement décor, astronomical horology, and sacred Vastu masterpieces crafted for heirloom residences and private estates worldwide.
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">International Flagships</span>
              <p className="text-xs text-[#D8E2CB] font-semibold">
                Mayfair (London) • Worli Sea Face (Mumbai) • Lutyens (Delhi) • Place Vendôme (Paris)
              </p>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4">Collections</h4>
            <ul className="space-y-2.5 text-xs text-[#E5E2DC]">
              <li><Link href="/shop?category=Sculptures" className="hover:text-[#D4AF37] transition-colors">Monumental Sculptures</Link></li>
              <li><Link href="/shop?category=Clocks" className="hover:text-[#D4AF37] transition-colors">Astronomical Clocks</Link></li>
              <li><Link href="/shop?category=Vastu Masterpieces" className="hover:text-[#D4AF37] transition-colors">Vastu Energy Pieces</Link></li>
              <li><Link href="/gifting" className="hover:text-[#D4AF37] transition-colors">Executive Gifting Suite</Link></li>
              <li><Link href="/shop?category=Curated Vases & Vessels" className="hover:text-[#D4AF37] transition-colors">Curated Vases & Vessels</Link></li>
            </ul>
          </div>

          {/* Column 3: Provenance & Salons */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4">Provenance</h4>
            <ul className="space-y-2.5 text-xs text-[#E5E2DC]">
              <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors">Atelier Heritage</Link></li>
              <li><Link href="/vastu" className="hover:text-[#D4AF37] transition-colors">Vastu Spatial Alignment</Link></li>
              <li><Link href="/membership" className="hover:text-[#D4AF37] transition-colors">VIP Patron Membership</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Global Salons & Map</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Private Curatorial Desk</Link></li>
            </ul>
          </div>

          {/* Column 4: Curatorial Concierge */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4">Private Desk</h4>
            <div className="space-y-3 text-xs text-[#E5E2DC]">
              <p>Direct assistance for private estate acquisitions and white-glove security delivery.</p>
              <div className="font-mono text-[#D4AF37] font-bold text-sm tracking-wide">+1 (800) LUX-VAULT</div>
              <Link href="/contact" className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37] pb-0.5 hover:text-white">
                Initiate Private Consultation &rarr;
              </Link>
              <div className="pt-2">
                <Link href="/crm" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FED488] bg-[#D4AF37]/15 px-2.5 py-1 rounded-md hover:bg-[#D4AF37]/25 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">dashboard</span>
                  <span>Executive CRM Suite &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#C2C8C1] gap-4">
          <div>
            &copy; {new Date().getFullYear()} Luxignia Artisanal Living Ltd. Directional Vastu Certified.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-[#D4AF37]">lock</span> Encrypted Checkout</span>
            <span>•</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-[#D4AF37]">verified</span> Authenticity Guaranteed</span>
            <span>•</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-[#D4AF37]">local_shipping</span> White-Glove Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
