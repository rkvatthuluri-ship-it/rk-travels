import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const BASE = import.meta.env.BASE_URL;

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  /* ---- Scroll-reveal animation via IntersectionObserver ---- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-grid hero-reveal" ref={sectionRef}>
          {/* Left Column — Content */}
          <div className="hero-content">
            <div className="hero-badge-container">
              <div className="hero-badge">
                <i className="fas fa-star"></i>
                RK Cabs
              </div>
              <div className="hero-badge hero-badge-special">
                <i className="fas fa-plane"></i>
                {t('Airport Transfer Specialists')}
              </div>
            </div>

            <h1 className="hero-heading">
              {t('Your Journey,')}
              <span className="hero-heading-gold">{t('Elevated.')}</span>
            </h1>

            <p className="hero-description">
              {t('Premium travel experiences with comfort, safety and reliability. Specialized in seamless Airport Pickup & Drop services. Every mile, a promise of exceptional service.')}
            </p>

            {/* Added Features Deck for richer aesthetics */}
            <div className="hero-features-deck">
              <div className="hero-feature-tag hero-feature-tag-special">
                <i className="fas fa-plane-departure"></i>
                <span>{t('Premium Hyderabad & Andhra Airport Cabs')}</span>
              </div>
              <div className="hero-feature-tag">
                <i className="fas fa-star"></i>
                <span>{t('Top Rated Cab Service')}</span>
              </div>
              <div className="hero-feature-tag">
                <i className="fas fa-shield-alt"></i>
                <span>{t('500+ Safe Rides Completed')}</span>
              </div>
              <div className="hero-feature-tag">
                <i className="fas fa-clock"></i>
                <span>{t('100% On-Time Promise')}</span>
              </div>
            </div>

            <a href="#contact" className="hero-cta">
              {t('Book Your Ride')}
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {/* Right Column — Image */}
          <div className="hero-image-col">
            <div className="hero-image-wrapper">
              <img
                src={`${BASE}images/hero_car.png`}
                alt="Premium travel vehicle by RK Cabs"
                className="hero-image"
                loading="eager"
                width="560"
                height="360"
              />
              <span className="hero-label hero-label-top">RK Cabs</span>
              <span className="hero-label hero-label-bottom">RK Cabs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
