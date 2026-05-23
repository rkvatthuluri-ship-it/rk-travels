import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Services.css';
import { services } from '../data/services';
import ServiceModal from './ServiceModal';

const SERVICE_KEYS = ['airport', 'localRides', 'outstation', 'templePackages'];

export default function Services() {
  const { t } = useLanguage();
  const [activeService, setActiveService] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClose = () => setActiveService(null);

  return (
    <section
      className={`services ${revealed ? 'services--revealed' : ''}`}
      id="services"
      ref={sectionRef}
    >
      <div className="services__container">
        {/* Section Header */}
        <div className="services__header">
          <div className="services__tag">
            <span className="services__tag-line" />
            <span className="services__tag-text">{t('PREMIUM SERVICES')}</span>
            <span className="services__tag-line" />
          </div>
          <h2 className="services__title">{t('Travel Beyond Expectations')}</h2>
        </div>

        {/* Service Cards Grid */}
        <div className="services__grid">
          {SERVICE_KEYS.map((key, index) => {
            const service = services[key];
            if (!service) return null;

            return (
              <article
                key={key}
                className="services__card"
                style={{ '--card-index': index }}
                onClick={() => setActiveService(key)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${service.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveService(key);
                  }
                }}
              >
                <div className="services__icon-container">
                  <i className={`fas fa-${service.icon}`} />
                </div>
                <h3 className="services__card-title">{t(service.title)}</h3>
                <p className="services__card-desc">{t(service.description)}</p>
                <span className="services__card-cta">
                  {t('Explore')} <i className="fas fa-arrow-right" />
                </span>
              </article>
            );
          })}
        </div>
      </div>

      {/* Service Modal */}
      {activeService && (
        <ServiceModal
          serviceKey={activeService}
          serviceData={services[activeService]}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
