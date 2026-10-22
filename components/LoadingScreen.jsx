import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const statusPhrases = [
    'Harmonizing Sacred Geometry...',
    'Summoning Haute Horology & Bronze...',
    'Aligning Directional Vastu Plinths...',
    'Welcome to Luxignia Atelier'
  ];

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(100);
      setIsFinishing(true);
      const timer = setTimeout(() => {
        setIsDismissed(true);
        if (onComplete) onComplete();
      }, 150);
      return () => clearTimeout(timer);
    }

    const startTime = performance.now();
    const targetDuration = 1400; // 1.4s total cinematic entry

    let animationFrame;

    const updateLoader = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / targetDuration, 1);

      // Smooth custom luxury cubic-out curve
      const eased = Math.round(100 * (1 - Math.pow(1 - rawProgress, 3)));
      setProgress(eased);

      // Cycle status phrase smoothly
      if (eased < 35) {
        setStatusIndex(0);
      } else if (eased < 70) {
        setStatusIndex(1);
      } else if (eased < 95) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(updateLoader);
      } else {
        setProgress(100);
        setIsFinishing(true);
        // Seamless exit transition
        setTimeout(() => {
          setIsDismissed(true);
          if (onComplete) onComplete();
        }, 750);
      }
    };

    animationFrame = requestAnimationFrame(updateLoader);

    // Guaranteed fail-safe timeout: never hang the page under any circumstance
    const failSafeTimeout = setTimeout(() => {
      setProgress(100);
      setIsFinishing(true);
      setTimeout(() => {
        setIsDismissed(true);
        if (onComplete) onComplete();
      }, 500);
    }, 2200);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(failSafeTimeout);
    };
  }, [onComplete]);

  if (isDismissed) return null;

  return (
    <div
      id="luxignia-premium-loader"
      className={`fixed inset-0 z-[999999] pointer-events-auto flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isFinishing ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0F2A1E 0%, #0A1C13 65%, #050E09 100%)',
      }}
      aria-live="polite"
      aria-label="Loading Luxignia Atelier"
    >
      {/* Subtle Golden Ambient Glow & Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.25) 0%, transparent 60%),
            linear-gradient(to right, rgba(197, 160, 89, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(197, 160, 89, 0.05) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* Decorative Upper and Lower Gold Border Accents */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

      {/* Main Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Animated Brand Emblem / Crest */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#C5A059]/40 flex items-center justify-center p-3 relative bg-[#0A1C13]/80 shadow-[0_0_35px_rgba(197,160,89,0.18)]">
            {/* Spinning Golden Orbit Ring */}
            <div
              className="absolute inset-0 rounded-full border-t-2 border-r border-[#D4AF37] opacity-80 animate-spin"
              style={{ animationDuration: '4s' }}
            />
            {/* Counter-Spinning Inner Ring */}
            <div
              className="absolute inset-2 rounded-full border-b border-l border-[#C5A059]/60 opacity-60 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '6s' }}
            />
            {/* Botanical Lotus / Spa Crest Icon */}
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C8.5 7 6 11 6 15a6 6 0 0 0 12 0c0-4-2.5-8-6-13z" />
              <path d="M12 2c-2 5-6 8-6 12 0 1.5.5 3 1.5 4" opacity="0.6" />
              <path d="M12 2c2 5 6 8 6 12 0 1.5-.5 3-1.5 4" opacity="0.6" />
              <circle cx="12" cy="15" r="1.5" fill="#D4AF37" stroke="none" />
            </svg>
          </div>
        </div>

        {/* Brand Wordmark & Provenance */}
        <div className="space-y-1.5 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.3em] uppercase text-[#FCF9F3] font-medium drop-shadow-md">
            Luxignia
          </h1>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-semibold">
            Artisanal Living • Atelier Est. MCMXXIV
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full bg-[#173626]/80 rounded-full h-[2px] mb-4 relative overflow-hidden border border-[#C5A059]/20">
          <div
            className="h-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#FFF3C4] transition-all duration-150 ease-out shadow-[0_0_10px_#D4AF37]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Digital Counter & Status Phrase */}
        <div className="flex items-center justify-between w-full text-xs">
          <span className="font-serif tracking-widest text-[#C5A059] text-[13px] font-medium transition-all duration-300">
            {statusPhrases[statusIndex]}
          </span>
          <span className="font-mono text-[#FCF9F3]/90 text-[13px] font-bold tracking-wider tabular-nums">
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </div>
      </div>

      {/* Subtle Bottom Watermark */}
      <div className="absolute bottom-6 text-[9px] uppercase tracking-[0.4em] text-[#C5A059]/50">
        Mayfair • Paris • Mumbai • Dubai
      </div>
    </div>
  );
}
