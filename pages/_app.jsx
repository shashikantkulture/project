import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppProvider } from '../lib/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ParticlesBackground from '../components/ParticlesBackground';
import AuthModal from '../components/AuthModal';
import ShowroomModal from '../components/ShowroomModal';
import CheckoutModal from '../components/CheckoutModal';
import ThreeStudioModal from '../components/ThreeStudioModal';
import LoadingScreen from '../components/LoadingScreen';
import CustomCursor from '../components/CustomCursor';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // If page provides custom layout, use it
  if (Component.getLayout) {
    return (
      <AppProvider>
        <Head>
          <title>Luxignia CRM & E-Commerce Operating System</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {Component.getLayout(<Component {...pageProps} />)}
      </AppProvider>
    );
  }

  // If this is the flagship CRM suite route (/crm or subroutes)
  const isCrmRoute = router.pathname.startsWith('/crm');
  if (isCrmRoute) {
    return (
      <AppProvider>
        <Head>
          <title>Luxignia CRM & E-Commerce Operating System</title>
          <meta name="description" content="Next-generation $50k+ luxury SaaS & e-commerce intelligence management platform for Luxignia." />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AppProvider>
    );
  }

  // Storefront standard layout
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
        <LoadingScreen />
        <CustomCursor />
        <ParticlesBackground />
        <Header />
        <main className="flex-1 relative z-10 pt-28">
          <Component {...pageProps} />
        </main>
        <Footer />
        <CartDrawer />
        <AuthModal />
        <ShowroomModal />
        <CheckoutModal />
        <ThreeStudioModal />
      </div>
    </AppProvider>
  );
}
