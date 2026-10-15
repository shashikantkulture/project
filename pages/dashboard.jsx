import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../lib/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, setIsAuthModalOpen, wishlist, toggleWishlist, addToCart } = useApp();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'wishlist' | 'profile'
  const [orders, setOrders] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read tab from query if provided
  useEffect(() => {
    if (router.query.tab === 'favorites' || router.query.tab === 'wishlist') {
      setActiveTab('wishlist');
    }
  }, [router.query.tab]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    fetch('/api/orders', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders || []);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user, token]);

  // Fetch wishlist products
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          const filtered = data.products.filter((p) => wishlist.includes(p.id));
          setWishlistProducts(filtered);
        }
      })
      .catch(() => {});
  }, [wishlist]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-[#C5A059] mb-3">lock</span>
        <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">Patron Portal Access Required</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Please authenticate with your private credentials to inspect orders, active consignments, and saved curations.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="btn-primary mt-6 py-3 px-8 text-xs font-bold"
        >
          Sign In to Patron Sanctuary
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Patron Sanctuary Portal | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Top Header Card */}
        <div className="bg-[#0A1C13] rounded-3xl p-8 sm:p-10 border-2 border-[#D4AF37]/50 shadow-xl text-[#FCF9F3] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#173626] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-2xl font-serif font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="badge-gold mb-1">Patron Sanctuary</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FCF9F3]">{user.name}</h1>
              <p className="text-xs text-[#D8E2CB] mt-0.5">{user.email} • ID: {user.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/shop" className="btn-gold py-2.5 px-5 text-xs font-bold">
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#173626]/12 gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'orders' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Consignments & Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'wishlist' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Curator Wishlist ({wishlistProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'profile' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Estate Address & Profile
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#173626]/10 p-8">
                <span className="material-symbols-outlined text-5xl text-[#C5A059] mb-2">inventory_2</span>
                <h3 className="font-serif text-xl font-bold text-[#0A1C13]">No Masterpiece Consignments Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Acquire your first numbered artifact from our private atelier collections.
                </p>
                <Link href="/shop" className="btn-primary mt-6 inline-flex text-xs font-bold">
                  Explore Catalog
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-6 border border-[#173626]/12 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#173626]/8">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#8C6A1E]">
                        {ord.order_number || ord.orderNumber}
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Registered on {new Date(ord.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge-gold">
                        {ord.delivery_status || 'White-Glove In Transit'}
                      </span>
                      <div className="font-serif font-bold text-lg text-[#0A1C13]">
                        ${ord.total.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {ord.items &&
                      ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-xs">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-14 rounded-lg object-cover border border-[#173626]/10"
                            />
                          )}
                          <div className="flex-1">
                            <span className="font-serif font-bold text-sm text-[#0A1C13] block">
                              {item.title}
                            </span>
                            <span className="text-gray-500">
                              Qty: {item.qty} • ${(item.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Security Tracking */}
                  <div className="p-3 bg-[#F7F4EE] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-gray-600">
                      Courier: <span className="font-bold text-[#173626]">{ord.courier || 'Luxignia Armored Security'}</span>
                    </span>
                    <span className="font-mono font-bold text-[#8C6A1E]">
                      Tracking: {ord.tracking_code || 'LX-994821-SEC'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#173626]/10 p-8">
                <span className="material-symbols-outlined text-5xl text-[#C5A059] mb-2">favorite_border</span>
                <h3 className="font-serif text-xl font-bold text-[#0A1C13]">Your Curator Wishlist is Empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Click the heart icon on any masterwork to save it to your private portfolio.
                </p>
                <Link href="/shop" className="btn-primary mt-6 inline-flex text-xs font-bold">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="luxury-card p-5 bg-white flex flex-col justify-between">
                    <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] mb-4 relative">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0A1C13] line-clamp-1">{p.title}</h4>
                      <div className="font-serif font-bold text-sm text-[#8C6A1E] mt-1">
                        ${p.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/products/${p.id}`} className="btn-outline flex-1 py-2 text-center text-xs font-bold">
                        Inspect
                      </Link>
                      <button onClick={() => addToCart(p, 1)} className="btn-primary flex-1 py-2 text-xs font-bold">
                        Acquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-8 border border-[#173626]/12 shadow-sm max-w-2xl space-y-4 text-xs">
            <h3 className="font-serif text-xl font-bold text-[#0A1C13]">Registered Patron Dossier</h3>
            <div className="grid grid-cols-2 gap-4 py-2 border-b">
              <span className="text-gray-500 uppercase font-bold text-[11px]">Full Name:</span>
              <span className="font-bold text-[#0A1C13]">{user.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b">
              <span className="text-gray-500 uppercase font-bold text-[11px]">Email Address:</span>
              <span className="font-bold text-[#0A1C13]">{user.email}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b">
              <span className="text-gray-500 uppercase font-bold text-[11px]">Direct Phone:</span>
              <span className="font-bold text-[#0A1C13]">{user.phone || '+44 20 7946 0999'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b">
              <span className="text-gray-500 uppercase font-bold text-[11px]">Primary Estate Address:</span>
              <span className="font-bold text-[#0A1C13]">{user.address || 'Königinstr. 44, 80539 München, Germany'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2">
              <span className="text-gray-500 uppercase font-bold text-[11px]">Account Access Level:</span>
              <span className="badge-gold">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
