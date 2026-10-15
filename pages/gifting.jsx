import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function GiftingPage() {
  const { addToCart, toggleWishlist, isWishlisted, setStudioProduct } = useApp();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?category=Gifting')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGifts(data.products || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Executive Gifting Suite | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6A1E]">
            Diplomatic & Sovereign Presentations
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-[#0A1C13]">
            The Executive Gifting Suite
          </h1>
          <p className="text-sm sm:text-base text-[#4A574F] leading-relaxed font-medium">
            Heirloom centerpieces presented in velvet-lined mahogany cases with hand-engraved solid copper plaques for state dignitaries, milestones, and esteemed corporate partners.
          </p>
        </div>

        {/* Feature Banner */}
        <div className="bg-[#0A1C13] rounded-3xl p-8 sm:p-12 text-[#FCF9F3] border-2 border-[#D4AF37]/40 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">card_giftcard</span>
            <h3 className="font-serif font-bold text-base text-[#FCF9F3]">Bespoke Solid Mahogany Packaging</h3>
            <p className="text-[#D8E2CB] leading-relaxed">
              Every gifting artifact is ensconced in hand-crafted wood cases with brass hinges and plush velvet interiors.
            </p>
          </div>
          <div className="space-y-2">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">history_edu</span>
            <h3 className="font-serif font-bold text-base text-[#FCF9F3]">Engraved Copper Provenance Plaque</h3>
            <p className="text-[#D8E2CB] leading-relaxed">
              Personalized with family arms, recipient honorifics, or commemorative corporate dates.
            </p>
          </div>
          <div className="space-y-2">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">shield</span>
            <h3 className="font-serif font-bold text-base text-[#FCF9F3]">White-Glove Armored Courier</h3>
            <p className="text-[#D8E2CB] leading-relaxed">
              Direct hand delivery to boardrooms, penthouses, and private estates worldwide.
            </p>
          </div>
        </div>

        {/* Gifting Products Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b pb-4">
            <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">
              Curated Presentation Pieces
            </h2>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#173626] hover:text-[#8C6A1E]">
              View All Collections &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading gifting suite...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gifts.map((prod) => (
                <div key={prod.id} className="luxury-card p-5 bg-white flex flex-col justify-between group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] mb-4 relative">
                    <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {prod.vastu && <span className="vastu-pill absolute top-3 left-3 bg-white/95">{prod.vastu}</span>}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#173626] flex items-center justify-center hover:bg-[#173626] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isWishlisted(prod.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
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
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prod.subtitle}</p>
                    <div className="font-serif font-bold text-xl text-[#0A1C13] mt-3">
                      ${prod.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Link href={`/products/${prod.id}`} className="btn-outline flex-1 py-2 text-center text-xs font-bold">
                      Details
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
