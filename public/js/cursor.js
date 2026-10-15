/* ==========================================================================
   Luxignia — Custom Luxury Interactive Cursor
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  
  const label = document.createElement('div');
  label.className = 'custom-cursor-label';
  ring.appendChild(label);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp physics for cursor ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Dynamic Hover Listeners
  function attachCursorEvents() {
    // 3D Canvas
    document.querySelectorAll('.three-viewport, canvas, [data-cursor="3d"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-3d');
        label.textContent = 'ROTATE 360°';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-3d');
        label.textContent = '';
      });
    });

    // Interactive Buttons & Links
    document.querySelectorAll('button, a, .luxury-card, input, select, [data-cursor="pointer"]').forEach(el => {
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
  }

  attachCursorEvents();

  // Expose re-attach for dynamically loaded content
  window.refreshCustomCursor = attachCursorEvents;
});
