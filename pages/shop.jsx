import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../lib/AppContext';

export default function ShopPage() {
  const router = useRouter();
  const { addToCart, isWishlisted, toggleWishlist, setStudioProduct } = useApp();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState('All Collections');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedVastu, setSelectedVastu] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Read URL query params if any
  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    }
  }, [router.query.category]);

  // Fetch products with filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All Collections') {
      params.append('category', selectedCategory);
    }
    if (maxPrice) {
      params.append('maxPrice', maxPrice);
    }
    if (sortBy) {
      params.append('sort', sortBy);
    }
    if (selectedVastu && selectedVastu !== 'all') {
      params.append('vastu', selectedVastu);
    }
    if (searchQuery) {
      params.append('search', searchQuery);
    }

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, maxPrice, sortBy, selectedVastu, searchQuery]);

  const categories = [
    'All Collections',
    'Sculptures',
    'Clocks',
    'Vastu Masterpieces',
    'Gifting',
    'Curated Vases & Vessels',
  ];

  const vastuOptions = [
    { label: 'All Spatial Zones', value: 'all' },
    { label: 'North-East (Kubera / Abundance)', value: 'North-East' },
    { label: 'North / North-West (Harmony)', value: 'North' },
    { label: 'East (Center / Brahmasthan)', value: 'East' },
    { label: 'West (Stability & Preservation)', value: 'West' },
    { label: 'South / South-East (Power)', value: 'South' },
  ];

  const resetFilters = () => {
    setSelectedCategory('All Collections');
    setMaxPrice(30000);
    setSortBy('popularity');
    setSelectedVastu('all');
    setSearchQuery('');
  };

  return (
    <>
      <Head>
        <title>Curated Catalog | Luxignia Masterpiece Reserves</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Editorial Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#173626]/12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6A1E] block mb-1">
              Private Atelier Reserve
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#0A1C13]">
              The Masterpiece Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[#4A574F] mt-2 max-w-xl font-medium">
              Explore individually authenticated sculptures, astronomical clocks, and directional Vastu artifacts crafted in hand-cast bronze and 24K gold leaf.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sculptures, clocks, Vastu..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* PREMIUM FILTER TOOLBAR */}
        <div className="bg-[#F7F4EE] rounded-2xl p-6 border border-[#C5A059]/40 shadow-sm space-y-6">
          {/* Row 1: Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#173626]">
                Curated Category:
              </span>
              <span className="text-xs font-semibold text-[#8C6A1E]">
                {products.length} masterworks available
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#173626] text-[#FCF9F3] shadow-md border border-[#C5A059]'
                      : 'bg-white text-[#173626] border border-[#173626]/15 hover:border-[#C5A059] hover:bg-[#FDFBF7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Sliding Price Range Bar & Sort & Vastu Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#173626]/10">
            {/* 1. Sliding Price Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#173626] uppercase tracking-wider text-[11px]">Maximum Investment:</span>
                <span className="font-serif text-[#8C6A1E] text-base font-bold">
                  ${maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-[#ECE7DC] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                <span>$5,000</span>
                <span>$18,000</span>
                <span>$30,000+</span>
              </div>
            </div>

            {/* 2. Popularity & Sort Option */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626]">
                Arrangement & Priority:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#173626]/20 bg-white text-xs font-bold text-[#10261C] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="popularity">Most Coveted (Reviews & Demand)</option>
                <option value="rating">Highest Curatorial Rating (5.0★)</option>
                <option value="price-desc">Investment: Imperial to Reserve ($$$)</option>
                <option value="price-asc">Investment: Reserve to Imperial ($)</option>
              </select>
            </div>

            {/* 3. Vastu Direction Alignment */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626]">
                Directional Vastu Zone:
              </label>
              <select
                value={selectedVastu}
                onChange={(e) => setSelectedVastu(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#173626]/20 bg-white text-xs font-bold text-[#10261C] focus:outline-none focus:border-[#C5A059]"
              >
                {vastuOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips & Reset */}
          {(selectedCategory !== 'All Collections' || maxPrice < 30000 || selectedVastu !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#173626]/10 text-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Filters:</span>
              {selectedCategory !== 'All Collections' && (
                <span className="px-2.5 py-1 rounded-md bg-[#173626]/10 text-[#173626] font-bold text-xs flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Collections')}>×</button>
                </span>
              )}
              {maxPrice < 30000 && (
                <span className="px-2.5 py-1 rounded-md bg-[#173626]/10 text-[#173626] font-bold text-xs flex items-center gap-1">
                  Max: ${maxPrice.toLocaleString()}
                  <button onClick={() => setMaxPrice(30000)}>×</button>
                </span>
              )}
              {selectedVastu !== 'all' && (
                <span className="px-2.5 py-1 rounded-md bg-[#173626]/10 text-[#173626] font-bold text-xs flex items-center gap-1">
                  Vastu: {selectedVastu}
                  <button onClick={() => setSelectedVastu('all')}>×</button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-red-700 hover:underline ml-2"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* PRODUCT GRID - FULLY ARRANGED & HIGH-CONTRAST */}
        {loading ? (
          <div className="text-center py-24 text-gray-400">
            <span className="material-symbols-outlined text-4xl animate-spin mb-2">progress_activity</span>
            <p className="text-xs uppercase font-bold tracking-widest">Loading Catalog Reserves...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#173626]/10 p-8">
            <span className="material-symbols-outlined text-5xl text-[#C5A059] mb-2">search_off</span>
            <h3 className="font-serif text-2xl font-bold text-[#0A1C13]">No Masterpieces Match Your Filter</h3>
            <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
              Try adjusting the price slider or choosing a different collection category to view available artifacts.
            </p>
            <button
              onClick={resetFilters}
              className="btn-primary mt-6 py-2.5 px-6 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="luxury-card flex flex-col justify-between group p-5 bg-white"
              >
                {/* 1. Main High-Res Image View First */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] mb-4">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {prod.badge && <span className="badge-gold shadow-sm">{prod.badge}</span>}
                    {prod.vastu && <span className="vastu-pill bg-white/95 shadow-sm">{prod.vastu}</span>}
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

                  {/* Secondary 3D Studio Button */}
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

                {/* 2. Product Meta & Information */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#8C6A1E] mb-1">
                      <span>{prod.category}</span>
                      <span className="flex items-center gap-0.5 text-amber-600">
                        ★ {prod.rating} <span className="text-gray-400 font-normal">({prod.reviews_count})</span>
                      </span>
                    </div>

                    <Link href={`/products/${prod.id}`}>
                      <h3 className="font-serif text-lg font-bold text-[#0A1C13] hover:text-[#8C6A1E] transition-colors line-clamp-1">
                        {prod.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#5D6B62] line-clamp-2 mt-1 leading-relaxed">
                      {prod.subtitle || prod.description}
                    </p>
                  </div>

                  {/* 3. Pricing and Actions */}
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
                        className="btn-outline py-2 px-3.5 text-[11px] font-bold"
                      >
                        Inspect Full Page
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
      </div>
    </>
  );
}
