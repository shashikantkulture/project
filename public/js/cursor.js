/* ==========================================================================
   Luxignia — High-Visibility Luxury Custom Pointer & Interactive System
   ========================================================================== */

(function () {
  'use strict';

  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (isTouchDevice) {
    document.documentElement.classList.remove('has-custom-cursor');
    return;
  }

  document.documentElement.classList.add('has-custom-cursor');

  document.addEventListener('DOMContentLoaded', () => {
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      isReducedMotion = e.matches;
    });

    // Create high-visibility luxury arrow pointer
    const pointer = document.createElement('div');
    pointer.className = 'custom-cursor-pointer';
    pointer.innerHTML = `
      <svg class="w-7 h-7 -translate-x-[2px] -translate-y-[2px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.45)) drop-shadow(0 0 1px rgba(0,0,0,0.9));">
        <path d="M3 2L10.5 21L13.5 13.5L21 10.5L3 2Z" fill="#0A1C13" stroke="#0A1C13" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M3 2L10.5 21L13.5 13.5L21 10.5L3 2Z" fill="url(#vanillaGoldGrad)" stroke="#FFE699" stroke-width="0.8" stroke-linejoin="round"/>
        <path d="M3 2L13.5 13.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
        <defs>
          <linearGradient id="vanillaGoldGrad" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFF2B2"/>
            <stop offset="0.5" stop-color="#D4AF37"/>
            <stop offset="1" stop-color="#9E782F"/>
          </linearGradient>
        </defs>
      </svg>
    `;

    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';

    const label = document.createElement('div');
    label.className = 'custom-cursor-label';
    ring.appendChild(label);

    document.body.appendChild(pointer);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        pointer.style.opacity = '1';
        ring.style.opacity = '1';
      }

      pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    window.addEventListener('mousedown', () => {
      ring.classList.add('cursor-active');
      pointer.classList.add('cursor-active');
    });

    window.addEventListener('mouseup', () => {
      ring.classList.remove('cursor-active');
      pointer.classList.remove('cursor-active');
    });

    document.addEventListener('mouseleave', () => {
      pointer.style.opacity = '0';
      ring.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
      pointer.style.opacity = '1';
      ring.style.opacity = '1';
      isVisible = true;
    });

    // 60FPS Lerp Physics
    const lerpFactor = 0.16;
    function renderCursor() {
      if (isReducedMotion) {
        ringX = mouseX;
        ringY = mouseY;
      } else {
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;
      }

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    function attachCursorEvents() {
      document.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hidden'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hidden'));
      });

      document.querySelectorAll('.three-viewport, canvas, [data-cursor="3d"]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-3d');
          label.textContent = el.dataset.cursorText || 'ROTATE 360°';
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-3d');
          label.textContent = '';
        });
      });

      document.querySelectorAll('.luxury-card, [data-cursor="view"], [data-cursor="explore"]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-view');
          const customText = el.dataset.cursorText || el.dataset.cursor || 'VIEW';
          label.textContent = customText.toUpperCase();
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-view');
          label.textContent = '';
        });
      });

      document.querySelectorAll('button, .btn-primary, .btn-gold, .btn-outline, [role="button"], [data-cursor="button"]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
          if (el.dataset.cursorText) {
            label.textContent = el.dataset.cursorText;
          }
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
          label.textContent = '';
        });
      });

      document.querySelectorAll('a, .nav-link').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
      });
    }

    attachCursorEvents();
    window.refreshCustomCursor = attachCursorEvents;
  });
})();
