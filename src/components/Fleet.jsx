import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Fleet.css';

const WHATSAPP_BASE = 'https://wa.me/919391089897?text=';

export default function Fleet() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  const fleetItems = [
    {
      key: 'sedan',
      type: 'Sedan',
      models: 'Maruti Dzire / Toyota Etios',
      desc: 'Best for small families or business trips.',
      capacity: '4 Passengers + 1 Driver',
      bags: '2 Bags',
      icon: 'fa-car-side',
      features: ['A/C', 'GPS Tracking', 'Sanitized Car']
    },
    {
      key: 'ertiga',
      type: 'Family SUV',
      models: 'Maruti Ertiga',
      desc: 'Spacious seating, perfect for family tours.',
      capacity: '6 Passengers + 1 Driver',
      bags: '3 Bags',
      icon: 'fa-shuttle-space',
      features: ['A/C', 'GPS Tracking', 'Sanitized Car']
    },
    {
      key: 'innova',
      type: 'Premium SUV',
      models: 'Toyota Innova Crysta',
      desc: 'Ultimate comfort & luxury for long journeys.',
      capacity: '7 Passengers + 1 Driver',
      bags: '4 Bags',
      icon: 'fa-van-shuttle',
      features: ['A/C', 'GPS Tracking', 'Sanitized Car']
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fl-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.fl-animate');
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getBookingLink = (type) => {
    const msg = `Hi Rama Krishna, I want to book a ${type} cab. Please share details and pricing.`;
    return WHATSAPP_BASE + encodeURIComponent(msg);
  };

  return (
    <section className="fl-section" id="fleet" ref={sectionRef}>
      <div className="fl-header fl-animate">
        <div className="fl-tag">
          <span className="fl-tag-line" />
          <span className="fl-tag-text">{t('Our Fleet')}</span>
          <span className="fl-tag-line" />
        </div>
        <h2 className="fl-title">{t('Explore our premium cabs tailored for your ultimate comfort and travel needs.')}</h2>
      </div>

      <div className="fl-grid">
        {fleetItems.map((car, idx) => (
          <article
            key={car.key}
            className="fl-card fl-animate"
            style={{ transitionDelay: `${idx * 0.1}s` }}
          >
            {/* Visual Icon Header */}
            <div className="fl-card-image-section">
              <div className="fl-card-glow-bg" />
              <i className={`fas ${car.icon} fl-car-large-icon`} />
              <span className="fl-badge">{t(car.type)}</span>
            </div>

            {/* Content Details */}
            <div className="fl-card-body">
              <h3 className="fl-card-title">{car.models}</h3>
              <p className="fl-card-desc">{t(car.desc)}</p>

              {/* Specs */}
              <div className="fl-specs">
                <div className="fl-spec-item">
                  <i className="fas fa-users fl-spec-icon" />
                  <span>{t(car.capacity)}</span>
                </div>
                <div className="fl-spec-item">
                  <i className="fas fa-briefcase fl-spec-icon" />
                  <span>{t(car.bags)}</span>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="fl-features">
                {car.features.map((feat) => (
                  <span key={feat} className="fl-feature-tag">
                    <i className="fas fa-check-circle" />
                    {t(feat)}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href={getBookingLink(car.type)}
                target="_blank"
                rel="noopener noreferrer"
                className="fl-book-btn"
              >
                <i className="fab fa-whatsapp" />
                {t('Book Cab')}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
