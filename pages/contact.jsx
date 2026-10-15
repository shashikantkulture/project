import React, { useState } from 'react';
import Head from 'next/head';
import { useApp } from '../lib/AppContext';

export default function ContactPage() {
  const { user } = useApp();
  const [selectedSalon, setSelectedSalon] = useState('london');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    salon: 'London Mayfair Flagship',
    subject: 'Curatorial Acquisition Inquiry',
    message: '',
  });
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const salons = {
    london: {
      name: 'London Mayfair Flagship',
      address: '42 Mount Street, Mayfair, London W1K 2RN, United Kingdom',
      phone: '+44 20 7946 0999',
      hours: 'Mon – Sat: 10:00 – 19:00 (Private Salon by Appointment)',
      leadCurator: 'Eleanor Vance, Curator Director',
      coordinates: '51.509865, -0.150821',
      mapEmbedUrl: 'https://maps.google.com/maps?q=42+Mount+Street,+Mayfair,+London&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    mumbai: {
      name: 'Mumbai Worli Sea Face Atelier',
      address: 'Sky Atrium Level 36, Worli Sea Face, Mumbai 400030, India',
      phone: '+91 22 6120 8800',
      hours: 'Tue – Sun: 11:00 – 20:00 (Directional Vastu Studio)',
      leadCurator: 'Vikramaditya Roy, Senior Vastu Curator',
      coordinates: '19.014410, 72.815480',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Worli+Sea+Face,+Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    delhi: {
      name: 'Delhi Lutyens Private Suite',
      address: 'Amrita Shergill Marg, Lutyens Bungalow Zone, New Delhi 110003, India',
      phone: '+91 11 4150 9900',
      hours: 'By Private Invitation & Diplomatic Consultation',
      leadCurator: 'Dr. Meera Oberoi, Architectural Advisor',
      coordinates: '28.598310, 77.221940',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Amrita+Shergill+Marg,+New+Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    paris: {
      name: 'Paris Place Vendôme Salon',
      address: '14 Place Vendôme, 75001 Paris, France',
      phone: '+33 1 42 68 55 00',
      hours: 'Mon – Fri: 11:00 – 18:30 (Horological Art Vault)',
      leadCurator: 'Laurent de Saint-Germain, Master Horologist',
      coordinates: '48.867450, 2.329410',
      mapEmbedUrl: 'https://maps.google.com/maps?q=14+Place+Vendome,+Paris&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  };

  const currentSalon = salons[selectedSalon];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: 'Thank you. Your curatorial dossier has been received. Our Curatorial Desk will reply within 2 hours.',
        });
        setFormData({ ...formData, message: '' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to submit inquiry.' });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Connection failure. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Curatorial Concierge & Salons | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* BRAND PHILOSOPHY & DESCRIPTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-12 border-b border-[#173626]/12">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6A1E]">
              Atelier Philosophy & Provenance
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#0A1C13] leading-tight">
              The Architecture of Sacred Grandeur
            </h1>
            <p className="text-sm sm:text-base text-[#35433B] leading-relaxed">
              Founded at the intersection of classical European foundry art and ancient Vedic spatial science (Vastu Shastra), Luxignia creates monumental sculptures, mechanical clocks, and architectural vessels designed to hold authority in heirloom estates.
            </p>
            <p className="text-xs sm:text-sm text-[#5D6B62] leading-relaxed">
              Every creation is hand-cast in lost-wax bronze, plated in genuine 24-karat gold leaf, and numbered with an engraved solid copper plaque stamped with directional coordinates.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#173626]/10 text-xs">
              <div>
                <span className="font-serif font-bold text-lg text-[#0A1C13]">4 Salons</span>
                <p className="text-[11px] text-gray-500">London, Mumbai, Delhi, Paris</p>
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#0A1C13]">100% Vastu</span>
                <p className="text-[11px] text-gray-500">Directionally Certified</p>
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#0A1C13]">White-Glove</span>
                <p className="text-[11px] text-gray-500">Armored Estate Dispatch</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0A1C13] rounded-3xl p-8 border-2 border-[#D4AF37]/40 text-[#FCF9F3] shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#173626] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#FCF9F3]">Private Curatorial Desk</h3>
            <p className="text-xs text-[#D8E2CB] leading-relaxed">
              Direct access for estate managers, private collectors, and interior architects needing immediate acquisition support or white-glove security routing.
            </p>
            <div className="pt-2 border-t border-[#FCF9F3]/15 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Direct Telephone:</span>
                <span className="font-mono text-[#D4AF37] font-bold">+1 (800) LUX-VAULT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Confidential Desk:</span>
                <span className="text-[#A7F3D0]">concierge@luxignia.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Direct Hours:</span>
                <span>24/7 Dedicated Patron Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SALON MAP VIEW SELECTOR */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6A1E] block mb-1">
                Global Showroom Network
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">
                Salon Galleries & Map View
              </h2>
            </div>

            {/* Salon Switcher Buttons */}
            <div className="flex flex-wrap gap-2 bg-[#F7F4EE] p-1.5 rounded-2xl border border-[#173626]/12">
              {Object.keys(salons).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedSalon(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedSalon === key
                      ? 'bg-[#173626] text-white shadow-sm'
                      : 'text-[#173626] hover:bg-white/60'
                  }`}
                >
                  {key} Salon
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Active Salon Profile */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#C5A059]/40 shadow-md flex flex-col justify-between space-y-6">
              <div>
                <span className="badge-gold mb-3">Selected Flagship</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1C13]">
                  {currentSalon.name}
                </h3>

                <div className="space-y-4 mt-6 text-xs text-[#2D3831]">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#8C6A1E] text-lg mt-0.5">location_on</span>
                    <div>
                      <span className="font-bold block text-[#0A1C13]">Address:</span>
                      <p>{currentSalon.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#8C6A1E] text-lg mt-0.5">phone</span>
                    <div>
                      <span className="font-bold block text-[#0A1C13]">Direct Line:</span>
                      <p className="font-mono font-bold text-[#173626]">{currentSalon.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#8C6A1E] text-lg mt-0.5">schedule</span>
                    <div>
                      <span className="font-bold block text-[#0A1C13]">Consultation Hours:</span>
                      <p>{currentSalon.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#8C6A1E] text-lg mt-0.5">person</span>
                    <div>
                      <span className="font-bold block text-[#0A1C13]">Lead Curator:</span>
                      <p className="font-semibold text-[#8C6A1E]">{currentSalon.leadCurator}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#173626]/10">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(currentSalon.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full py-2.5 text-xs font-bold text-center block"
                >
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>

            {/* Right: Interactive Map Embed View */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#173626]/15 shadow-md min-h-[380px] bg-[#E5E7EB] relative">
              <iframe
                title={`${currentSalon.name} Map`}
                src={currentSalon.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* DIRECT CURATORIAL CONTACT FORM */}
        <div className="bg-[#F7F4EE] rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6A1E] block mb-1">
                Direct Communication
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#0A1C13]">
                Initiate Private Consultation
              </h2>
              <p className="text-xs sm:text-sm text-[#4A574F] mt-2">
                Share your residential spatial requirements or inquire about specific numbered pieces.
              </p>
            </div>

            {statusMsg && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
                    : 'bg-red-100 border border-red-300 text-red-950'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {statusMsg.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Duchess Sophia von Rose"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Confidential Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patron@estate.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 20 7946 0999"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                    Subject & Scope
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                  Private Curatorial Note / Spatial Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your residential room orientation, interested artworks, or questions regarding white-glove security delivery..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider"
                >
                  {loading ? 'Transmitting to Curatorial Desk...' : 'Transmit Dossier to Curatorial Desk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
