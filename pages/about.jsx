import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Atelier Heritage & Provenance | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6A1E]">
            Artisanal Lineage & Sacred Science
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-[#0A1C13]">
            The Atelier Story
          </h1>
          <p className="text-sm sm:text-base text-[#4A574F] leading-relaxed font-medium">
            Bridging three generations of master bronze foundries with ancient Vedic spatial geometry to create heirloom artworks that define contemporary architectural estates.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="luxury-card p-8 bg-white border border-[#C5A059]/40 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1C13] text-[#D4AF37] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">fireplace</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">Lost-Wax Foundry</h3>
            <p className="text-xs text-[#4A574F] leading-relaxed">
              Every master silhouette begins with a hand-sculpted clay positive, transformed through refractory molds and molten bronze alloy poured at 1,150°C.
            </p>
          </div>

          <div className="luxury-card p-8 bg-white border border-[#C5A059]/40 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1C13] text-[#D4AF37] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">24K Gold Leaf Gilding</h3>
            <p className="text-xs text-[#4A574F] leading-relaxed">
              Master gilders apply ultra-fine leaves of 24-karat gold using historic oil-size methods, followed by agate stone burnishing to achieve luminous warmth.
            </p>
          </div>

          <div className="luxury-card p-8 bg-white border border-[#C5A059]/40 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1C13] text-[#D4AF37] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">explore</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">Vastu Energy Alignment</h3>
            <p className="text-xs text-[#4A574F] leading-relaxed">
              Every design adheres strictly to cardinal grid divisions (Brahmasthan, Kubera, and Varuna zones) to foster prosperity, mental clarity, and harmonic resonance.
            </p>
          </div>
        </div>

        {/* Big Editorial Feature Block */}
        <div className="bg-[#0A1C13] rounded-3xl p-8 sm:p-14 text-[#FCF9F3] border-2 border-[#D4AF37]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="badge-gold">Ethos of Perpetuity</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FCF9F3]">
                Heirloom Significance Designed for Generations
              </h2>
              <p className="text-xs sm:text-sm text-[#D8E2CB] leading-relaxed">
                In an era dominated by transient trends and fast furnishings, Luxignia crafts singular monuments with authentic weight and tactile permanence.
              </p>
              <p className="text-xs sm:text-sm text-[#D8E2CB] leading-relaxed">
                Accompanied by an authenticated copper provenance plaque registered in our central archives, each acquisition becomes a foundational pillar of its collector’s legacy.
              </p>
              <div className="pt-2">
                <Link href="/shop" className="btn-gold py-3 px-6 text-xs font-bold inline-flex">
                  Explore Current Masterpiece Reserves
                </Link>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-lg">
              <img
                src="/images/products/Elegant Horse Sculpture in Warm Interior.png"
                alt="Luxignia Atelier Bronze Masterpiece"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
