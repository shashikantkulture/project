/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-deep': '#0A1C13',
        'forest-brand': '#173626',
        'forest-mid': '#1D4330',
        'forest-light': '#25523C',
        'gold-antique': '#C5A059',
        'gold-bright': '#D4AF37',
        'gold-subtle': 'rgba(197, 160, 89, 0.2)',
        'bg-linen': '#FCF9F3',
        'surface-linen': '#F7F4EE',
        'surface-muted': '#ECE7DC',
        'charcoal-text': '#1A211E',
        'text-primary': '#1C1C18',
        'text-muted': '#4A544D',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 8px 25px rgba(197, 160, 89, 0.22)',
        'luxury': '0 12px 35px rgba(10, 28, 19, 0.1)',
      }
    },
  },
  plugins: [],
};
