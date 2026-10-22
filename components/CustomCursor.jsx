import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // 'default', 'hover-button', 'hover-link', 'view', '3d', 'hidden'
  const [isMouseDown, setIsMouseDown] = useState(false);

  const pointerRef = useRef(null);
  const ringRef = useRef(null);

  // Positions for smooth lerping
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    // 1. Touch & Coarse Pointer check: Disable on mobile/touch devices
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (isTouchDevice) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    // 2. Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = motionQuery.matches;
    const handleMotionChange = (e) => {
      isReducedMotion.current = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Initial position
    mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ringPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Mouse Move Listener
    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseLeaveWindow = () => {
      if (pointerRef.current) pointerRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleMouseEnterWindow = () => {
      if (pointerRef.current) pointerRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Dynamic Element Hover Detection
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      // 1. Form Inputs - hide custom pointer so native cursor & text caret work cleanly
      if (
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[contenteditable="true"]')
      ) {
        setCursorState('hidden');
        return;
      }

      // 2. Buttons, CTAs, interactive controls
      const elBtn = target.closest(
        'button, .btn-primary, .btn-gold, .btn-outline, [role="button"], [data-cursor="button"]'
      );
      if (elBtn) {
        setCursorState('hover-button');
        return;
      }

      // 3. Navigation Links & Text Links
      const elLink = target.closest('a, .nav-link');
      if (elLink) {
        setCursorState('hover-link');
        return;
      }

      // 4. 3D Canvas / Viewports
      const el3D = target.closest('canvas, .three-viewport, [data-cursor="3d"]');
      if (el3D) {
        setCursorState('3d');
        return;
      }

      // 5. Product Cards, Gallery Images, Artwork
      const elCard = target.closest(
        '.luxury-card, [data-cursor="view"], [data-cursor="explore"], .product-media-frame'
      );
      if (elCard) {
        setCursorState('view');
        return;
      }

      // Default state
      setCursorState('default');
    };

    document.addEventListener('mouseover', handleMouseOver);

    // 60FPS Lerp Physics Loop for Trailing Ring
    const lerpFactor = 0.18;
    const render = () => {
      if (isReducedMotion.current) {
        ringPos.current.x = mousePos.current.x;
        ringPos.current.y = mousePos.current.y;
      } else {
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.removeEventListener('mouseover', handleMouseOver);
      motionQuery.removeEventListener('change', handleMotionChange);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!enabled) return null;

  // Compute ring dimensions and visual styling based on interaction state - always transparent, never blocking product view
  let ringClasses = 'w-8 h-8 border border-[#C5A059]/60 bg-transparent shadow-[0_0_10px_rgba(197,160,89,0.25)]';
  let pointerOpacity = 'opacity-100';

  if (cursorState === 'hidden') {
    ringClasses = 'w-0 h-0 border-transparent opacity-0 pointer-events-none';
    pointerOpacity = 'opacity-0 pointer-events-none';
  } else if (cursorState === 'hover-button') {
    ringClasses = 'w-12 h-12 border border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.4)]';
    pointerOpacity = 'opacity-100 scale-105';
  } else if (cursorState === 'hover-link') {
    ringClasses = 'w-11 h-11 border border-[#C5A059] bg-[#C5A059]/10 shadow-[0_0_14px_rgba(197,160,89,0.35)]';
    pointerOpacity = 'opacity-100 scale-100';
  } else if (cursorState === 'view' || cursorState === '3d') {
    // Elegant subtle expansion without any dark popup or text blocking the product
    ringClasses = 'w-12 h-12 border border-[#D4AF37]/80 bg-transparent shadow-[0_0_16px_rgba(212,175,55,0.3)]';
    pointerOpacity = 'opacity-100 scale-100';
  }

  return (
    <>
      {/* High-Visibility Custom Luxury Pointer (Precision Gold Needle / Arrow with Dark Contrast Edge) */}
      <div
        ref={pointerRef}
        className={`fixed top-0 left-0 pointer-events-none z-[1000000] transition-opacity duration-150 ease-out ${pointerOpacity}`}
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <svg
          className={`w-7 h-7 -translate-x-[2px] -translate-y-[2px] transition-transform duration-150 ${
            isMouseDown ? 'scale-90' : 'scale-100'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 2px rgba(0, 0, 0, 0.9))',
          }}
        >
          {/* Outer high-contrast dark border */}
          <path
            d="M3 2L10.5 21L13.5 13.5L21 10.5L3 2Z"
            fill="#0A1C13"
            stroke="#0A1C13"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner 24K Gold luxury facet */}
          <path
            d="M3 2L10.5 21L13.5 13.5L21 10.5L3 2Z"
            fill="url(#luxGoldGradient)"
            stroke="#FFE699"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* Subtle center spine for 3D luxury watch-hand look */}
          <path
            d="M3 2L13.5 13.5"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="luxGoldGradient" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2B2" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#9E782F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Trailing Fluid Luxury Halo / Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[999999] flex items-center justify-center transition-all duration-300 ease-out ${ringClasses} ${
          isMouseDown ? 'scale-85' : 'scale-100'
        }`}
        style={{
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  );
}
