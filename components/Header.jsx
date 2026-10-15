import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../lib/AppContext';

export default function Header() {
  const router = useRouter();
  const { user, handleLogout, cartCount, wishlist, setIsCartOpen, setIsShowroomOpen, setIsAuthModalOpen, setAuthMode } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && router.pathname === '/') return true;
    if (path !== '/' && router.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Atelier', href: '/about' },
    { label: 'Shop Collection', href: '/shop' },
    { label: 'Gifting Suite', href: '/gifting' },
    { label: 'Vastu & Energy', href: '/vastu' },
    { label: 'VIP Membership', href: '/membership' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FCF9F3]/95 backdrop-blur-md border-b border-[#173626]/10 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#FED488] text-[#5D4201] text-[11px] font-bold tracking-widest uppercase py-1.5 px-4 text-center border-b border-[#C5A059]/20 flex items-center justify-center gap-3">
        <span>Curated For Discerning Spaces</span>
        <span className="opacity-40">•</span>
        <span>7-Day White-Glove Returns</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline">Vastu Directional Certified</span>
        <span className="opacity-40 hidden md:inline">•</span>
        <span className="hidden md:inline">Pan-India Security Delivery</span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 1. Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="material-symbols-outlined text-[#C5A059] text-3xl group-hover:scale-110 transition-transform">spa</span>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#173626] leading-none">Luxignia</span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#C5A059] font-bold mt-1">Artisanal Living</span>
          </div>
        </Link>

        {/* 2. Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase transition-colors rounded-md ${
                isActive(link.href)
                  ? 'text-[#173626] bg-[#173626]/8 border-b-2 border-[#C5A059]'
                  : 'text-[#424843] hover:text-[#173626] hover:bg-[#173626]/4'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Role-gated Navigation Links */}
          {user && ['staff', 'admin', 'super_admin'].includes(user.role) && (
            <Link
              href="/crm"
              className={`px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase flex items-center gap-1 text-[#8C6A1E] bg-[#D4AF37]/15 rounded-md ${
                isActive('/crm') ? 'border border-[#C5A059]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span>CRM</span>
            </Link>
          )}

          {user && ['admin', 'super_admin'].includes(user.role) && (
            <Link
              href="/admin"
              className={`px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase flex items-center gap-1 text-purple-900 bg-purple-100 rounded-md ${
                isActive('/admin') ? 'border border-purple-400' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* 3. Right: Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Search Trigger */}
          <Link
            href="/shop"
            className="p-2 text-[#424843] hover:text-[#173626] hover:bg-[#173626]/5 rounded-full transition-colors"
            title="Search Catalog"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </Link>

          {/* Wishlist */}
          <Link
            href={user ? '/dashboard?tab=favorites' : '/shop'}
            className="p-2 text-[#424843] hover:text-[#173626] hover:bg-[#173626]/5 rounded-full transition-colors relative"
            title="Curator Wishlist"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-[#424843] hover:text-[#173626] hover:bg-[#173626]/5 rounded-full transition-colors relative"
            title="Acquisition Bag"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#0A1C13] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Book Visit Button */}
          <button
            onClick={() => setIsShowroomOpen(true)}
            className="hidden md:inline-flex btn-outline py-2 px-3.5 text-xs font-semibold"
          >
            <span>Book Visit</span>
          </button>

          {/* Auth State Button / Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#ECE7DC] border border-[#C5A059]/40 hover:bg-white transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#173626] text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs font-bold text-[#173626] max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-[16px] text-gray-500">expand_more</span>
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-[#173626]/12 py-2 z-50"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-bold text-xs text-[#173626]">{user.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {user.role}
                    </span>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#F7F4EE]">
                    <span className="material-symbols-outlined text-[16px]">account_circle</span>
                    <span>My Patron Portal</span>
                  </Link>
                  <Link href="/dashboard?tab=orders" className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#F7F4EE]">
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    <span>My Acquisitions</span>
                  </Link>
                  {['staff', 'admin', 'super_admin'].includes(user.role) && (
                    <Link href="/crm" className="flex items-center gap-2 px-4 py-2 text-xs text-[#8C6A1E] font-bold hover:bg-[#F7F4EE]">
                      <span className="material-symbols-outlined text-[16px]">leaderboard</span>
                      <span>Executive CRM</span>
                    </Link>
                  )}
                  {['admin', 'super_admin'].includes(user.role) && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-xs text-purple-900 font-bold hover:bg-[#F7F4EE]">
                      <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="btn-primary py-2 px-4 text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#173626] hover:bg-[#173626]/5 rounded-lg"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FCF9F3] border-t border-[#173626]/10 px-6 py-6 space-y-3 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-lg ${
                isActive(link.href) ? 'text-[#173626] bg-[#173626]/10' : 'text-[#424843]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && ['staff', 'admin', 'super_admin'].includes(user.role) && (
            <Link
              href="/crm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold uppercase tracking-wider text-[#8C6A1E] bg-[#D4AF37]/15 rounded-lg"
            >
              Executive CRM
            </Link>
          )}
          {user && ['admin', 'super_admin'].includes(user.role) && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold uppercase tracking-wider text-purple-900 bg-purple-100 rounded-lg"
            >
              Admin Console
            </Link>
          )}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsShowroomOpen(true);
              }}
              className="btn-gold w-full py-3 text-xs"
            >
              Book Showroom Visit
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
