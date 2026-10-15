import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../../lib/AppContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart, isWishlisted, toggleWishlist, setStudioProduct, setIsShowroomOpen } = useApp();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('vastu'); // 'vastu' | 'materials' | 'logistics'

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);
          setRelated(data.related || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#173626]">
        <span className="material-symbols-outlined text-5xl animate-spin mb-3">progress_activity</span>
        <h3 className="font-serif text-xl font-bold">Unlocking Masterpiece Archive...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">Masterpiece Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The requested artifact may have been acquired into private estate storage.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <>
      <Head>
        <title>{product.title} | Luxignia Masterpiece</title>
        <meta name="description" content={product.subtitle || product.description} />
      </Head>

      <div className="min-h-screen pb-20">
        {/* Full-width Breadcrumb Navigation */}
        <div className="bg-[#F7F4EE] border-b border-[#173626]/10 py-3.5 px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-[#4A574F]">
            <Link href="/" className="hover:text-[#173626]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#173626]">Shop Collection</Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#173626]">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#173626] font-bold truncate">{product.title}</span>
          </div>
        </div>

        {/* FULL SCREEN DEDICATED PRODUCT VIEW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT: IMAGE VIEW FIRST WITH GALLERY & 3D LAUNCHER BUTTON */}
            <div className="lg:col-span-7 space-y-4">
              {/* 1. Main High-Resolution Photo Viewport */}
              <div className="relative aspect-[4/3] sm:aspect-[16/12] rounded-2xl overflow-hidden bg-white border border-[#C5A059]/40 shadow-xl group">
                <img
                  src={selectedImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges on Main Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start pointer-events-none">
                  {product.badge && <span className="badge-gold shadow-md">{product.badge}</span>}
                  {product.vastu && <span className="vastu-pill bg-white/95 shadow-md font-bold">{product.vastu}</span>}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 text-[#173626] flex items-center justify-center hover:bg-[#173626] hover:text-white transition-all shadow-md"
                  title="Curator Wishlist"
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isWishlisted(product.id) ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              {/* 2. Secondary Choice: Interactive 3D Studio Button */}
              <div className="p-4 bg-[#F7F4EE] rounded-2xl border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1C13] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl">view_in_ar</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#0A1C13]">
                      Interactive 3D Studio Experience
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      Rotate 360°, inspect shadow facets, and toggle between 24K gold, bronze & marble finishes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStudioProduct(product)}
                  className="btn-gold py-2.5 px-6 text-xs font-bold whitespace-nowrap shadow-md flex items-center gap-2 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-base">360</span>
                  <span>Launch 3D Studio</span>
                </button>
              </div>

              {/* 3. Thumbnail Gallery Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === imgUrl
                          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40 scale-105'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: COMPREHENSIVE CURATORIAL SPECIFICATIONS & ACQUISITION */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#8C6A1E] mb-2">
                  <span>{product.category}</span>
                  <span className="font-mono text-gray-500">{product.sku}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1C13] leading-tight">
                  {product.title}
                </h1>

                <p className="text-sm font-medium text-[#4A574F] mt-2 leading-relaxed">
                  {product.subtitle}
                </p>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#173626]/10">
                  <div className="font-serif text-3xl font-bold text-[#0A1C13]">
                    ${product.price.toLocaleString()}
                  </div>
                  <span className="badge-gold">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>Direct Atelier Registry</span>
                  </span>
                </div>
              </div>

              {/* Core Description */}
              <p className="text-xs sm:text-sm text-[#2D3831] leading-relaxed">
                {product.description}
              </p>

              {/* Specification Table */}
              <div className="bg-white rounded-2xl p-5 border border-[#173626]/12 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#173626]/8">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Material:</span>
                  <span className="font-bold text-[#0A1C13] text-right max-w-xs">{product.material || '24K Antiqued Gold Leaf, Italian Plinth'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#173626]/8">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Dimensions:</span>
                  <span className="font-bold text-[#0A1C13]">{product.dimensions || '42cm × 18cm × 58cm'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#173626]/8">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Weight:</span>
                  <span className="font-bold text-[#0A1C13]">{product.weight || '14.2 kg'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#173626]/8">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Vastu Zone:</span>
                  <span className="font-bold text-[#173626]">{product.vastu || 'North-East (Kubera Zone)'}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Provenance:</span>
                  <span className="font-bold text-[#8C6A1E]">Solid Copper Numbered Plaque Included</span>
                </div>
              </div>

              {/* Acquisition Action Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#173626]/20 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-9 h-9 rounded-lg bg-[#F7F4EE] text-[#173626] font-bold flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#173626]">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-9 h-9 rounded-lg bg-[#F7F4EE] text-[#173626] font-bold flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Acquire Button */}
                  <button
                    onClick={() => addToCart(product, qty)}
                    className="flex-1 btn-primary py-3.5 text-xs font-bold tracking-wider"
                  >
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    <span>Acquire Artifact (${(product.price * qty).toLocaleString()})</span>
                  </button>
                </div>

                {/* Concierge Inquire Button */}
                <button
                  onClick={() => setIsShowroomOpen(true)}
                  className="w-full btn-outline py-3 text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  <span>Inquire with Curatorial Concierge (White-Glove)</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#173626]/12 text-center text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                <div className="p-2 rounded-lg bg-[#F7F4EE]">
                  <span>Insured Transport</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F7F4EE]">
                  <span>7-Day Return</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F7F4EE]">
                  <span>Vastu Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILED CURATORIAL SPECIFICATION TABS */}
          <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-[#173626]/12 shadow-sm">
            <div className="flex border-b border-[#173626]/12 gap-8 mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('vastu')}
                className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${
                  activeTab === 'vastu' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
                }`}
              >
                Vastu & Spatial Alignment
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${
                  activeTab === 'materials' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
                }`}
              >
                Materials & Craftsmanship
              </button>
              <button
                onClick={() => setActiveTab('logistics')}
                className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${
                  activeTab === 'logistics' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
                }`}
              >
                White-Glove Delivery Protocol
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'vastu' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">
                  Directional Harmonization: {product.vastu || 'North-East Zone'}
                </h3>
                <p className="text-sm text-[#4A574F] leading-relaxed">
                  In classical Vastu Shastra architecture, proper positioning activates cosmic resonance and geometric equilibrium.
                  {product.vastu_benefit ? ` Specifically, this piece channels: "${product.vastu_benefit}".` : ''}
                </p>
                <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#C5A059]/40 text-xs text-[#173626] space-y-1">
                  <div className="font-bold">Recommended Placement Directive:</div>
                  <p>Orient on a honed marble or solid walnut plinth at eye level facing North-East to maximize natural morning sunlight illumination.</p>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">
                  Atelier Foundry & Gilded Finishes
                </h3>
                <p className="text-sm text-[#4A574F] leading-relaxed">
                  Every sculpture begins with a lost-wax bronze casting, chased by hand by third-generation metalworkers.
                  The 24K gold leaf is applied using historic oil gilding techniques before receiving an organic microcrystalline protective seal.
                </p>
              </div>
            )}

            {activeTab === 'logistics' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">
                  Armored White-Glove Security Delivery
                </h3>
                <p className="text-sm text-[#4A574F] leading-relaxed">
                  Your piece is encased within a velvet-lined, shock-absorbent mahogany crate and transported by dedicated logistics personnel.
                  Upon arrival, our white-glove technicians handle unpackaging, directional alignment, and cleanup.
                </p>
              </div>
            )}
          </div>

          {/* RELATED MASTERPIECE RESERVES */}
          {related.length > 0 && (
            <div className="mt-20">
              <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#173626]/12">
                <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">
                  Complementary Atelier Masterworks
                </h2>
                <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#173626] hover:text-[#8C6A1E]">
                  View Entire Reserve &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <div key={rel.id} className="luxury-card p-5 bg-white flex flex-col justify-between group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] mb-4 relative">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {rel.vastu && <span className="vastu-pill absolute top-3 left-3 bg-white/95">{rel.vastu}</span>}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0A1C13] line-clamp-1">{rel.title}</h4>
                      <div className="font-serif font-bold text-sm text-[#8C6A1E] mt-1">${rel.price.toLocaleString()}</div>
                    </div>
                    <Link
                      href={`/products/${rel.id}`}
                      className="btn-outline mt-4 py-2 text-[11px] font-bold text-center block"
                    >
                      Inspect Masterpiece
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
