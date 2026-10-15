import React from 'react';
import Head from 'next/head';
import { AppProvider } from '../lib/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ParticlesBackground from '../components/ParticlesBackground';
import AuthModal from '../components/AuthModal';
import ShowroomModal from '../components/ShowroomModal';
import CheckoutModal from '../components/CheckoutModal';
import ThreeStudioModal from '../components/ThreeStudioModal';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Head>
        <title>Luxignia | Artisanal Luxury Décor & Vastu Masterpieces</title>
        <meta
          name="description"
          content="Artisanal luxury statement décor, astronomical horology, and sacred Vastu masterpieces crafted for heirloom residences and private estates worldwide."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative min-h-screen flex flex-col bg-[#FCF9F3] text-[#10261C]">
        {/* Full-screen Gold Particles Effect */}
        <ParticlesBackground />

        {/* Global Structured Header */}
        <Header />

        {/* Main Content View */}
        <main className="flex-1 relative z-10 pt-28">
          <Component {...pageProps} />
        </main>

        {/* Global Visible High-Contrast Footer */}
        <Footer />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <AuthModal />
        <ShowroomModal />
        <CheckoutModal />
        <ThreeStudioModal />
      </div>
    </AppProvider>
  );
}
