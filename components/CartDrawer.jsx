import React from 'react';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateCartQty, removeFromCart, cartTotal, setIsCheckoutOpen } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A1C13]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCF9F3] shadow-2xl flex flex-col border-l border-[#C5A059]/30">
          {/* Header */}
          <div className="p-6 bg-[#F7F4EE] border-b border-[#173626]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D4AF37] text-2xl">shopping_bag</span>
              <h3 className="font-serif text-xl font-bold text-[#173626]">Acquisition Bag</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-gray-500 hover:text-[#173626] rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-[#424843]">
                <span className="material-symbols-outlined text-5xl text-[#C5A059] mb-3">shopping_bag</span>
                <h4 className="font-serif text-lg font-bold text-[#173626]">Your Acquisition Bag is Empty</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Explore our artisanal collections to select statement pieces for your residence.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-outline text-xs mt-6 inline-flex"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 bg-white rounded-xl border border-[#173626]/10 shadow-sm flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border border-[#C5A059]/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-xs text-[#173626] truncate">{item.title}</h5>
                    <div className="font-serif font-bold text-[#173626] text-sm mt-0.5">
                      ${item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartQty(item.productId, -1)}
                        className="w-5 h-5 rounded bg-[#ECE7DC] text-[#173626] text-xs font-bold flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#173626]">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.productId, 1)}
                        className="w-5 h-5 rounded bg-[#ECE7DC] text-[#173626] text-xs font-bold flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F7F4EE] border-t border-[#173626]/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Total Investment:</span>
                <span className="font-serif text-2xl font-bold text-[#173626]">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#C5A059]">verified</span>
                <span>White-Glove Insured Delivery Included</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="btn-primary w-full py-3.5 text-xs font-bold"
              >
                <span>Proceed to Private Checkout</span>
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
