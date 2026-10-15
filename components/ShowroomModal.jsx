import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export default function ShowroomModal() {
  const { isShowroomOpen, setIsShowroomOpen, user } = useApp();
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showroom, setShowroom] = useState('London Mayfair Flagship (42 Mount Street)');
  const [visitDate, setVisitDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:30 (Private Salon)');
  const [service, setService] = useState('Comprehensive Vastu & Spatial Sculpture Curation');
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isShowroomOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/showroom-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patronName: name,
          email,
          phone,
          showroom,
          visitDate: visitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          timeSlot,
          requestedService: service,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Private Showroom Appointment Confirmed. Our curatorial director will contact you directly within 2 hours.' });
        setTimeout(() => {
          setIsShowroomOpen(false);
          setStatusMsg(null);
        }, 3000);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to submit appointment.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A1C13]/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsShowroomOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#FCF9F3] rounded-2xl shadow-2xl border border-[#C5A059]/40 overflow-hidden z-10 animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#173626] text-[#FCF9F3] p-6 relative border-b border-[#D4AF37]/30 flex-shrink-0">
          <button
            onClick={() => setIsShowroomOpen(false)}
            className="absolute top-4 right-4 text-[#D8E2CB] hover:text-[#D4AF37] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">event_seat</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Private Salon Appointment</span>
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FCF9F3]">
            Reserve Showroom Consultation
          </h3>
          <p className="text-xs text-[#D8E2CB] mt-1">
            Experience our masterworks in dedicated private salons under directional gallery lighting.
          </p>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 overflow-y-auto flex-1">
          {statusMsg && (
            <div
              className={`mb-4 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
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
                  Patron Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
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
                  placeholder="+44 20 7946 0999"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                Confidential Email *
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
                Select Salon Location *
              </label>
              <select
                value={showroom}
                onChange={(e) => setShowroom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="London Mayfair Flagship (42 Mount Street)">London Mayfair Flagship (42 Mount Street, W1K 2RN)</option>
                <option value="Mumbai Worli Sea Face (Sky Atrium Level 36)">Mumbai Worli Sea Face (Sky Atrium Level 36)</option>
                <option value="Delhi Lutyens Atelier (Amrita Shergill Marg)">Delhi Lutyens Atelier (Amrita Shergill Marg)</option>
                <option value="Paris Place Vendôme (Private Salon Suite)">Paris Place Vendôme (Private Salon Suite)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                  Preferred Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="11:00 - 12:30 (Morning Sunlight Salon)">11:00 - 12:30 (Morning Sunlight Salon)</option>
                  <option value="14:00 - 15:30 (Afternoon Private Viewing)">14:00 - 15:30 (Afternoon Private Viewing)</option>
                  <option value="16:30 - 18:00 (Evening Champagne Viewing)">16:30 - 18:00 (Evening Champagne Viewing)</option>
                  <option value="19:00 - 20:30 (After-Hours Vault Inspection)">19:00 - 20:30 (After-Hours Vault Inspection)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173626] mb-1">
                Curation & Consultation Scope
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#173626]/20 bg-white text-sm text-[#10261C] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Comprehensive Vastu & Spatial Sculpture Curation">Comprehensive Vastu & Spatial Sculpture Curation</option>
                <option value="Astronomical Clocks & Mechanical Art Inspection">Astronomical Clocks & Mechanical Art Inspection</option>
                <option value="Bespoke Commission / Sovereign Crest Customization">Bespoke Commission / Sovereign Crest Customization</option>
                <option value="Executive Suite & Corporate Hospitality Gifting">Executive Suite & Corporate Hospitality Gifting</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>{loading ? 'Confirming with Concierge...' : 'Confirm Private Salon Reservation'}</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-gray-500">
              Chauffeur collection and bespoke hospitality available upon request.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
