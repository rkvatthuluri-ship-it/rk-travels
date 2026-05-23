import { useState, useEffect } from 'react';
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
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    // Default to '#/' if no hash is present or empty
    const hash = window.location.hash;
    return hash && hash !== '#' ? hash : '#/';
  });

  // Track hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentPath(hash && hash !== '#' ? hash : '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle smooth scrolling to sections when navigating back to home page
  useEffect(() => {
    if (currentPath !== '#/about-us') {
      const hashSegment = currentPath.replace('#/', '');
      const elementId = hashSegment === 'home' || hashSegment === '' ? 'home' : hashSegment;
      
      // Delay slightly to ensure Home elements are fully mounted
      const timer = setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
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
    </LanguageProvider>
  );
}

export default App;
