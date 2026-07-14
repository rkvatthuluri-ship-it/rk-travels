import { useState, useEffect, useRef } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Fleet from './components/Fleet';
import ContactBanner from './components/ContactBanner';
import AboutUsPage from './components/AboutUsPage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MobileCTA from './components/MobileCTA';
import ChatbotWidget from './components/ChatbotWidget';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    // Default to '#/services' if no hash is present or empty to focus on services
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') {
      return '#/services';
    }
    return hash;
  });

  const isInitialLoad = useRef(true);

  // Sync hash in address bar on initial mount if empty/root
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') {
      window.location.hash = '#/services';
    }
  }, []);

  // Track hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentPath(hash && hash !== '#' ? hash : '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle scrolling to sections when navigating back to home page
  useEffect(() => {
    if (currentPath !== '#/about-us') {
      const hashSegment = currentPath.replace('#/', '');
      const elementId = hashSegment === 'home' || hashSegment === '' ? 'home' : hashSegment;
      
      // Use instant scroll on initial mount, smooth scroll on user clicks
      const behavior = isInitialLoad.current ? 'auto' : 'smooth';
      isInitialLoad.current = false;
      
      // Delay slightly to ensure Home elements are fully mounted
      const timer = setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior });
        }
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  const isAboutRoute = currentPath === '#/about-us';

  return (
    <LanguageProvider>
      {/* Ambient background glows */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Pass currentPath to control active nav links */}
      <Header currentPath={currentPath} />

      <main>
        {isAboutRoute ? (
          <AboutUsPage />
        ) : (
          <>
            <Hero />
            <Services />
            <Fleet />
            <ContactBanner />
          </>
        )}
      </main>

      <Footer />
      <ScrollToTop />
      <MobileCTA />
      <ChatbotWidget />
    </LanguageProvider>
  );
}

export default App;
