import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, removeFromCart, user, setLastOrder } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('Concierge Wire Transfer');
  const [specialInstructions, setSpecialInstructions] = useState('White-glove placement per Vastu directional alignment.');
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState('');

  if (!isCheckoutOpen) return null;

  const handleCompleteAcquisition = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patronName: name,
          email,
          phone,
          address,
          paymentMethod,
          items: cart,
          specialInstructions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedOrder(data.order);
        setLastOrder(data.order);
        // Clear cart
        cart.forEach((item) => removeFromCart(item.productId));
      } else {
        setError(data.error || 'Acquisition order failed.');
      }
    } catch (err) {
      setError('Connection failure. Please contact curatorial concierge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A1C13]/80 backdrop-blur-md transition-opacity"
        onClick={() => !loading && setIsCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-[#FCF9F3] rounded-2xl shadow-2xl border border-[#C5A059]/40 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-[#0A1C13] text-[#FCF9F3] p-6 relative border-b border-[#D4AF37]/40 flex-shrink-0">
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-4 right-4 text-[#D8E2CB] hover:text-[#D4AF37] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">verified_user</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              White-Glove Acquisition Protocol
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FCF9F3]">
            {confirmedOrder ? 'Consignment Confirmed' : 'Finalize Masterpiece Acquisition'}
          </h3>
          <p className="text-xs text-[#E5E2DC] mt-1">
            {confirmedOrder
              ? `Order ${confirmedOrder.orderNumber || confirmedOrder.order_number} is registered with our Security Logistics Concierge.`
              : 'Direct vault shipment with insured armored transport and certificate of provenance.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-xs font-semibold text-red-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {confirmedOrder ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">done_all</span>
              </div>

              <div>
                <span className="badge-gold mb-2">Authenticated Consignment</span>
                <h4 className="font-serif text-2xl font-bold text-[#173626]">
                  Acquisition Successfully Registered
                </h4>
                <div className="font-mono text-sm font-bold text-[#8C6A1E] mt-1">
                  Reference: {confirmedOrder.orderNumber || confirmedOrder.order_number}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#173626]/10 text-left max-w-lg mx-auto space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Patron Beneficiary:</span>
                  <span className="font-bold text-[#173626]">{confirmedOrder.patronName || name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Total Investment:</span>
                  <span className="font-bold text-[#173626] text-sm">
                    ${(confirmedOrder.total || cartTotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Dispatch Status:</span>
                  <span className="font-bold text-emerald-700">Under Curatorial Security Preparation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Courier Service:</span>
                  <span className="font-bold text-[#173626]">Luxignia Armored White-Glove Logistics</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                An authenticated copper certificate with registered directional Vastu alignment coordinates has been generated. Our Curatorial Director will contact your designated liaison prior to arrival.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setConfirmedOrder(null);
                  }}
                  className="btn-primary py-3 px-8 text-xs font-bold"
                >
                  Return to Salon Catalog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCompleteAcquisition} className="space-y-5">
              {/* Items Summary Pill */}
              <div className="p-4 bg-white rounded-xl border border-[#173626]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Acquisition Selection</span>
                  <div className="font-serif font-bold text-[#173626] text-sm mt-0.5">
                    {cart.map((i) => `${i.title} (×${i.qty})`).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Investment</span>
                  <div className="font-serif font-bold text-xl text-[#8C6A1E]">
                    ${cartTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Alistair Sterling"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7946 0912"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Private Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@estate.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Settlement Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Concierge Wire Transfer">Concierge Wire Transfer (Standard)</option>
                    <option value="Private Estate Invoice (Net 30)">Private Estate Invoice (Net 30)</option>
                    <option value="Encrypted Amex Centurion / Visa Infinite">Encrypted Centurion / Infinite Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                  Estate Delivery Destination *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Eaton Square, Belgravia, London SW1W 9BD or Altamount Road, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                  White-Glove & Vastu Directives
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Unpack in North-East salon corner; coordinate with interior architect."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>{loading ? 'Registering Consignment...' : `Authorize Acquisition ($${cartTotal.toLocaleString()})`}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest pt-1">
                <span>Insured Armored Freight</span>
                <span>•</span>
                <span>Provenance Escrow</span>
                <span>•</span>
                <span>Direct Atelier Warranty</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
