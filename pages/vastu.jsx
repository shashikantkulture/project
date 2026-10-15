import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function VastuPage() {
  const { addToCart, setStudioProduct } = useApp();
  const [vastuProducts, setVastuProducts] = useState([]);
  const [selectedZone, setSelectedZone] = useState('North-East');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?category=Vastu Masterpieces')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVastuProducts(data.products || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const zones = [
    {
      name: 'North-East (Ishanya / Kubera)',
      ruler: 'Kubera & Jupiter (Wisdom & Abundance)',
      element: 'Water & Ether',
      effect: 'Inflow of executive wealth, mental clarity, spiritual upliftment.',
      idealArtifact: 'Ascending Stallions, Crystal Obelisks, Faceted Emerald Core Sculptures.',
    },
    {
      name: 'North (Kuber / Mercury)',
      ruler: 'Mercury (Commerce & Precision)',
      element: 'Water',
      effect: 'Commercial agility, career ascension, smooth cash flow.',
      idealArtifact: 'Astronomical Pendulum Clocks, Mirror Chrome Stags.',
    },
    {
      name: 'Center (Brahmasthan)',
      ruler: 'Cosmic Core (Supreme Harmony)',
      element: 'Ether / Pure Space',
      effect: 'Structural balance of the estate, peaceful vibration across all floors.',
      idealArtifact: 'Geometric Obelisks, Sacred Torus Vessels.',
    },
    {
      name: 'South-West (Nairutya / Earth)',
      ruler: 'Rahu (Leadership Authority)',
      element: 'Earth',
      effect: 'Unshakable executive authority, foundation stability, legacy defense.',
      idealArtifact: 'Monumental Eagles, Heavy Bronze Busts on Carrara Marble.',
    },
  ];

  return (
    <>
      <Head>
        <title>Directional Vastu Science & Spatial Alignment | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6A1E]">
            Ancient Vedic Spatial Science
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-[#0A1C13]">
            Vastu & Energetic Alignment
          </h1>
          <p className="text-sm sm:text-base text-[#4A574F] leading-relaxed font-medium">
            Discover how architectural geometry, precious lost-wax metals, and directional placement transform residential energy zones into beacons of prosperity.
          </p>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zones.map((z, idx) => (
            <div key={idx} className="luxury-card p-8 bg-white border border-[#C5A059]/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge-gold">{z.element}</span>
                <span className="text-[11px] font-mono text-gray-400">ZONE 0{idx + 1}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">{z.name}</h3>
              <p className="text-xs text-[#173626] font-bold">Ruler: {z.ruler}</p>
              <p className="text-xs text-[#4A574F] leading-relaxed">
                <span className="font-semibold text-gray-700">Energetic Influence: </span>
                {z.effect}
              </p>
              <div className="p-3 bg-[#F7F4EE] rounded-xl text-xs text-[#8C6A1E] font-semibold">
                Harmonizing Artefact: {z.idealArtifact}
              </div>
            </div>
          ))}
        </div>

        {/* Vastu Masterpieces Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b pb-4">
            <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">
              Vastu Certified Creations
            </h2>
            <Link href="/shop?category=Vastu Masterpieces" className="text-xs font-bold uppercase tracking-wider text-[#173626] hover:text-[#8C6A1E]">
              View All Vastu Pieces &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading Vastu masterpieces...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vastuProducts.map((prod) => (
                <div key={prod.id} className="luxury-card p-5 bg-white flex flex-col justify-between group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] mb-4 relative">
                    <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {prod.vastu && <span className="vastu-pill absolute top-3 left-3 bg-white/95">{prod.vastu}</span>}
                    <div className="absolute bottom-3 inset-x-3">
                      <button
                        onClick={() => setStudioProduct(prod)}
                        className="w-full py-2 px-3 rounded-lg bg-[#0A1C13]/85 backdrop-blur-sm text-[#FCF9F3] hover:bg-[#0A1C13] hover:text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <span className="material-symbols-outlined text-sm text-[#D4AF37]">view_in_ar</span>
                        <span>3D Interactive Studio</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0A1C13] line-clamp-1">{prod.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prod.vastu_benefit || prod.subtitle}</p>
                    <div className="font-serif font-bold text-xl text-[#0A1C13] mt-3">
                      ${prod.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Link href={`/products/${prod.id}`} className="btn-outline flex-1 py-2 text-center text-xs font-bold">
                      Inspect
                    </Link>
                    <button onClick={() => addToCart(prod, 1)} className="btn-primary flex-1 py-2 text-xs font-bold">
                      Acquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
