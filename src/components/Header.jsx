import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home', href: '#/', sectionId: 'home', icon: 'fas fa-home' },
  { label: 'Services', href: '#/services', sectionId: 'services', icon: 'fas fa-concierge-bell' },
  { label: 'Fleet', href: '#/fleet', sectionId: 'fleet', icon: 'fas fa-car' },
  { label: 'Contact', href: '#/contact', sectionId: 'contact', icon: 'fas fa-envelope' },
  { label: 'About Us', href: '#/about-us', sectionId: 'about-us', icon: 'fas fa-shield-alt' },
];

const WHATSAPP_BASE = 'https://wa.me/919391089897?text=';

export default function Header({ currentPath = '#/' }) {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const WHATSAPP_URL = WHATSAPP_BASE + encodeURIComponent('Hi RK Cabs! I would like to book a ride.');

  const isAboutRoute = currentPath === '#/about-us';

  /* ---- Scroll listener: header shrink + active section ---- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Scroll highlighting is only active on the Home page route
      if (!isAboutRoute) {
        const homeSectionIds = ['home', 'services', 'fleet', 'contact'];
        const scrollPos = window.scrollY + 120; // offset for header height
        let currentSec = 'home';

        for (const id of homeSectionIds) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollPos) {
            currentSec = id;
          }
        }
        setActiveSection(currentSec);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAboutRoute]);

  // If we are on the About Us route, force the active section highlight to 'about-us'
  useEffect(() => {
    if (isAboutRoute) {
      setActiveSection('about-us');
    } else {
      // Re-trigger scroll calculation when returning to home page
      window.dispatchEvent(new Event('scroll'));
    }
  }, [isAboutRoute]);

  /* ---- Lock body scroll when drawer is open ---- */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleNavClick = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <a href="#/" className="header-logo" aria-label="RK Cabs Home">
          <div className="header-logo-icon">
            <i className="fas fa-taxi"></i>
          </div>
          <span className="header-logo-text">
            <span>RK</span> CABS
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="header-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`header-nav-link${
                activeSection === link.sectionId ? ' active' : ''
              }`}
            >
              {t(link.label)}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Language Switch */}
        <div className="header-lang-container-desktop">
          <div className="header-lang-switch">
            <button 
              className={`header-lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >EN</button>
            <span className="header-lang-separator">|</span>
            <button 
              className={`header-lang-btn ${language === 'te' ? 'active' : ''}`}
              onClick={() => setLanguage('te')}
            >తెలుగు</button>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta"
          >
            {t('Book Now')} <i className="fab fa-whatsapp"></i>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="header-toggle"
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
        >
          <i className={drawerOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </button>
      </div>

      {/* Mobile Backdrop */}
      <div
        className={`header-backdrop${drawerOpen ? ' open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        className={`header-drawer${drawerOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="header-drawer-header">
          <span className="header-drawer-logo">
            <span>RK</span> CABS
          </span>
          
          <div className="header-drawer-actions">
            {/* Mobile language switch inside drawer */}
            <div className="header-lang-switch">
              <button 
                className={`header-lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >EN</button>
              <span className="header-lang-separator">|</span>
              <button 
                className={`header-lang-btn ${language === 'te' ? 'active' : ''}`}
                onClick={() => setLanguage('te')}
              >తెలుగు</button>
            </div>
            <button
              className="header-drawer-close"
              onClick={closeDrawer}
              aria-label="Close menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="header-drawer-nav">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`header-drawer-link${
                activeSection === link.sectionId ? ' active' : ''
              }`}
              onClick={handleNavClick}
            >
              <i className={link.icon}></i>
              {t(link.label)}
            </a>
          ))}
        </div>

        <div className="header-drawer-bottom">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-drawer-cta"
            onClick={handleNavClick}
          >
            <i className="fab fa-whatsapp"></i>
            {t('Book Now')}
          </a>
          <a href="tel:+919391089897" className="header-drawer-phone">
            <i className="fas fa-phone-alt"></i>
            +91 93910 89897
          </a>
        </div>
      </nav>
    </header>
  );
}
