import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Founder.css';

export default function Founder() {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fd-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.fd-animate');
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="fd-section" id="founder" ref={sectionRef}>
      <div className="fd-container">
        {/* Section Header */}
        <div className="fd-header fd-animate">
          <div className="fd-tag">
            <span className="fd-tag-line" />
            <span className="fd-tag-text">{t('About Us')}</span>
            <span className="fd-tag-line" />
          </div>
          <h2 className="fd-title">{t('Meet the Founder')}</h2>
        </div>

        {/* Founder Card/Grid */}
        <div className="fd-grid fd-animate">
          {/* Left: Image / Placeholder */}
          <div className="fd-image-col">
            <div className="fd-image-wrapper">
              {!imgError ? (
                <img
                  src={`${import.meta.env.BASE_URL}images/founder.jpg`}
                  alt="Rama Krishna - Founder of RK Cabs"
                  className="fd-image"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="fd-image-placeholder">
                  <div className="fd-placeholder-avatar">
                    <i className="fas fa-user-tie" />
                  </div>
                  <span className="fd-placeholder-text">RK CABS</span>
                </div>
              )}
              {/* Outer decorative ring */}
              <div className="fd-image-ring" />
            </div>
          </div>

          {/* Right: Biography / Quote */}
          <div className="fd-content-col">
            <div className="fd-badge">{t('Founder & Director')}</div>
            <h3 className="fd-name">{t('Rama Krishna')}</h3>
            
            <div className="fd-quote-container">
              <i className="fas fa-quote-left fd-quote-icon" />
              <blockquote className="fd-quote">
                {t('founder_quote')}
              </blockquote>
            </div>

            <p className="fd-description">
              {t('Available 24/7 to manage and oversee your travel plans. Feel free to reach out directly for group bookings, packages, or special travel arrangements.')}
            </p>

            <div className="fd-actions">
              <a href="tel:+919391089897" className="fd-call-btn">
                <i className="fas fa-phone-alt" />
                {t('Call Rama Krishna')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
