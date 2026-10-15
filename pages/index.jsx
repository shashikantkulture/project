import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function HomePage() {
  const { addToCart, isWishlisted, toggleWishlist, setStudioProduct, setIsShowroomOpen } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=1')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const heroItem = featuredProducts[0] || {
    id: 'prod-1',
    title: 'Aurelius — Gilded Stallion Sculpture',
    subtitle: 'Artisanal Ascending Horse in 24K Gold Leaf & Marble Plinth',
    price: 14800,
    vastu: 'North-East (Kubera Zone)',
    badge: 'The Corner-Office Favourite',
    image: '/images/products/Elegant Horse Sculpture in Warm Interior.png',
    description: 'Sculptural décor, astronomical clocks and gilded Vastu pieces — chosen one by one for discerning homes, executive penthouses, and private estates.',
  };

  const categories = [
    {
      title: 'Monumental Sculptures',
      desc: 'Hand-cast bronze & 24K gold leaf equestrian and crest silhouettes.',
      badge: 'Sculptural Heritage',
      link: '/shop?category=Sculptures',
      img: '/images/products/Elegant Horse Sculpture on Pedestal.png',
    },
    {
      title: 'Astronomical Clocks',
      desc: '8-day mechanical pendulum escapements in burnished brass & sapphire glass.',
      badge: 'Horological Art',
      link: '/shop?category=Clocks',
      img: '/images/products/Teal Ring with Golden Stag Sculpture.png',
    },
    {
      title: 'Vastu Energy Masterpieces',
      desc: 'Harmonized sacred geometry obelisks and emerald crystals for high-energy zones.',
      badge: 'Spatial Alignment',
      link: '/shop?category=Vastu Masterpieces',
      img: '/images/products/Emerald and Gold Wave Sculpture.png',
    },
  ];

  return (
    <>
      <Head>
        <title>Luxignia | Artisanal Luxury Décor & Vastu Living</title>
      </Head>

      <div className="space-y-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#173626]/8 border border-[#173626]/15">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#173626]">
                  {heroItem.badge || 'The Corner-Office Favourite'}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#0A1C13] leading-[1.12]">
                Objects that <span className="italic font-normal underline decoration-[#C5A059]/60 underline-offset-8">hold</span> the room.
              </h1>

              <p className="text-base sm:text-lg text-[#35433B] leading-relaxed max-w-xl font-normal">
                Sculptural décor, astronomical clocks and gilded Vastu pieces — chosen one by one for discerning homes, executive penthouses, and private estates.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/shop" className="btn-primary py-3.5 px-8 text-xs font-bold tracking-wider">
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>

                <button
                  onClick={() => setIsShowroomOpen(true)}
                  className="btn-outline py-3 px-6 text-xs font-bold tracking-wider"
                >
                  <span>Book Showroom Visit</span>
                </button>
              </div>

              {/* Curated Trust Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#173626]/12">
                <div>
                  <div className="font-serif text-2xl font-bold text-[#173626]">100%</div>
                  <div className="text-[11px] font-semibold text-[#5D6B62] uppercase tracking-wider mt-0.5">
                    Directional Vastu
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#173626]">24K</div>
                  <div className="text-[11px] font-semibold text-[#5D6B62] uppercase tracking-wider mt-0.5">
                    Gold Leaf Plating
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#173626]">Armored</div>
                  <div className="text-[11px] font-semibold text-[#5D6B62] uppercase tracking-wider mt-0.5">
                    White-Glove Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Res Feature Frame with 3D Launcher */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-t-[160px] rounded-b-3xl bg-[#F4EFE6] border-2 border-[#C5A059]/30 p-6 pb-8 shadow-2xl overflow-hidden group">
                {/* Background Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/10 via-transparent to-[#173626]/10 pointer-events-none" />

                {/* Top Badge */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="badge-gold">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>Artisanal Masterwork</span>
                  </span>
                  <span className="vastu-pill font-bold">
                    {heroItem.vastu || 'North-East Zone'}
                  </span>
                </div>

                {/* High-Resolution Main Photography */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/60 border border-[#173626]/10 mb-5">
                  <img
                    src={heroItem.image}
                    alt={heroItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* 3D Studio Secondary Launcher Button Floating on Image */}
                  <div className="absolute bottom-4 inset-x-4 flex justify-center">
                    <button
                      onClick={() => setStudioProduct(heroItem)}
                      className="btn-gold py-2.5 px-5 text-xs font-bold rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">view_in_ar</span>
                      <span>Launch 3D Interactive Studio (360°)</span>
                    </button>
                  </div>
                </div>

                {/* Hero Item Details & Action */}
                <div className="relative z-10 text-center space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">
                    {heroItem.title}
                  </h3>
                  <div className="font-serif text-xl font-bold text-[#8C6A1E]">
                    ${heroItem.price.toLocaleString()}
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-3">
                    <Link
                      href={`/products/${heroItem.id}`}
                      className="btn-primary py-2.5 px-5 text-xs font-bold"
                    >
                      View Masterpiece Details
                    </Link>
                    <button
                      onClick={() => addToCart(heroItem, 1)}
                      className="btn-outline py-2.5 px-4 text-xs font-bold"
                    >
                      Acquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURATED STATEMENT CATEGORIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#173626]/15">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6A1E] block mb-1">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1C13]">
                Artisanal Statement Reserves
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#173626] hover:text-[#8C6A1E] flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View Full Catalog</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="luxury-card p-6 flex flex-col justify-between group hover:border-[#C5A059]"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-[#F4EFE6]">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="badge-gold mb-3">{cat.badge}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#0A1C13] mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#4A574F] leading-relaxed mb-6 font-medium">
                    {cat.desc}
                  </p>
                </div>

                <Link
                  href={cat.link}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#173626] group-hover:text-[#8C6A1E] transition-colors"
                >
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* SHOWROOM MASTERPIECE RESERVE (GRID OF FULL PRODUCTS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6A1E] block mb-1">
              Masterpiece Reserve
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1C13]">
              Showroom Curations
            </h2>
            <p className="text-xs sm:text-sm text-[#4A574F] mt-2 font-medium">
              Individually numbered masterworks crafted with authentic materials from our private atelier.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading curations...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((prod) => (
                <div
                  key={prod.id}
                  className="luxury-card flex flex-col justify-between group p-5 bg-white"
                >
                  {/* Image View in First View */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] mb-4">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Vastu & Badge tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {prod.badge && <span className="badge-gold shadow-sm">{prod.badge}</span>}
                      {prod.vastu && <span className="vastu-pill bg-white/90 shadow-sm">{prod.vastu}</span>}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#173626] flex items-center justify-center hover:bg-[#173626] hover:text-white transition-colors shadow-sm"
                      title="Curator Wishlist"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isWishlisted(prod.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    {/* Secondary Choice: 3D Studio Button */}
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

                  {/* Information & Action */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-[#8C6A1E] mb-1">
                        {prod.category}
                      </div>
                      <Link href={`/products/${prod.id}`}>
                        <h3 className="font-serif text-lg font-bold text-[#0A1C13] hover:text-[#8C6A1E] transition-colors line-clamp-1">
                          {prod.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#5D6B62] line-clamp-2 mt-1 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#173626]/10 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Investment</div>
                        <div className="font-serif text-xl font-bold text-[#0A1C13]">
                          ${prod.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${prod.id}`}
                          className="btn-outline py-2 px-3 text-[11px] font-bold"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="btn-primary py-2 px-3.5 text-[11px] font-bold"
                        >
                          Acquire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* WORDS FROM OUR PATRONS (TESTIMONIALS) - FIXED TEXT VISIBILITY WITH HIGH-CONTRAST DEEP FOREST BACKGROUND */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A1C13] rounded-3xl p-8 sm:p-12 lg:p-16 border-2 border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
            {/* Background Texture & Soft Gold Gradient */}
            <div className="absolute inset-0 bg-radial-gradient from-[#173626]/50 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl mb-12">
              <span className="badge-gold mb-3">Patron Provenance</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FCF9F3]">
                Words from our Patrons
              </h2>
              <p className="text-xs sm:text-sm text-[#D8E2CB] mt-2 font-medium">
                Distinguished testimonials from private estate owners and interior architects across Europe and Asia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-[#142E20] border border-[#D4AF37]/30 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                    {'★'.repeat(5)}
                  </div>
                  <blockquote className="font-serif text-lg sm:text-xl italic text-[#FCF9F3] leading-relaxed font-normal">
                    "The Aurelius Stallion commands our Munich salon with an aura that photographs can scarcely convey. The craftsmanship and Vastu precision are unmatched."
                  </blockquote>
                </div>
                <div className="border-t border-[#FCF9F3]/15 pt-4">
                  <div className="font-serif font-bold text-sm text-[#D4AF37]">
                    High Duchess Sophia von Rose
                  </div>
                  <div className="text-xs text-[#D8E2CB]">
                    Patron of the Arts • Munich, Germany
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl bg-[#142E20] border border-[#D4AF37]/30 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                    {'★'.repeat(5)}
                  </div>
                  <blockquote className="font-serif text-lg sm:text-xl italic text-[#FCF9F3] leading-relaxed font-normal">
                    "Luxignia creates heirloom pieces that transcend modern trends. Their private concierge service was immaculate from consultation to installation."
                  </blockquote>
                </div>
                <div className="border-t border-[#FCF9F3]/15 pt-4">
                  <div className="font-serif font-bold text-sm text-[#D4AF37]">
                    Lord Alistair Sterling
                  </div>
                  <div className="text-xs text-[#D8E2CB]">
                    Private Collector • Belgravia, London
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIP ATELIER CONCIERGE BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-[#F7F4EE] rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6A1E]">
                Bespoke Architectural Advisory
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1C13]">
                Commission a One-of-a-Kind Masterpiece
              </h3>
              <p className="text-xs sm:text-sm text-[#4A574F] leading-relaxed">
                Connect with our senior sculptors and certified Vastu practitioners to craft custom directional emblems cast specifically for your spatial orientation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
              <Link href="/contact" className="btn-primary py-3.5 px-6 text-xs font-bold">
                Consult Atelier Director
              </Link>
              <Link href="/membership" className="btn-outline py-3.5 px-6 text-xs font-bold">
                VIP Patron Vault
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
