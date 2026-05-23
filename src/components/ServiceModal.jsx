import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ServiceModal.css';

const WHATSAPP_BASE = 'https://wa.me/919391089897?text=';

function getWhatsAppUrl(serviceKey, item, t, language) {
  let message = '';

  if (language === 'te') {
    switch (serviceKey) {
      case 'airport':
        message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(item.name)} (${t(item.city)}) కి ఎయిర్‌పోర్ట్ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        break;
      case 'localRides':
        message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(item)} లో లోకల్ సిటీ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        break;
      case 'outstation':
        message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(item)} కి అవుట్‌స్టేషన్ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        break;
      default:
        message = 'నమస్కారం రామకృష్ణ గారు, నేను ఒక క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.';
    }
  } else {
    switch (serviceKey) {
      case 'airport':
        message = `Hi Rama Krishna, I want to book Airport Pickup/Drop at ${item.name}, ${item.city}.`;
        break;
      case 'localRides':
        message = `Hi Rama Krishna, I want to book a Local City Ride in ${item}.`;
        break;
      case 'outstation':
        message = `Hi Rama Krishna, I want to book an Outstation Trip to ${item}.`;
        break;
      default:
        message = 'Hi Rama Krishna, I want to book a service.';
    }
  }

  return WHATSAPP_BASE + encodeURIComponent(message);
}

function getPackageWhatsAppUrl(packageName, t, language) {
  const message = language === 'te'
    ? `నమస్కారం రామకృష్ణ గారు, నేను ${t(packageName)} ఆలయ ప్యాకేజీని బుక్ చేసుకోవాలనుకుంటున్నాను. దయచేసి వివరాలను తెలియజేయండి.`
    : `Hi Rama Krishna, I want to book the ${packageName}. Please share details.`;
  return WHATSAPP_BASE + encodeURIComponent(message);
}

export default function ServiceModal({ serviceKey, serviceData, onClose }) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePackageIndex, setActivePackageIndex] = useState(null);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  const isTemple = serviceKey === 'templePackages';

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Auto-focus search input
  useEffect(() => {
    if (!isTemple && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isTemple]);

  // Handle backdrop click
  const handleBackdropClick = () => onClose();
  const handleModalClick = (e) => e.stopPropagation();

  // Toggle package expansion (accordion mode: only one open at a time)
  const togglePackage = (index) => {
    setActivePackageIndex((prev) => (prev === index ? null : index));
  };

  // Filter search items
  const getFilteredItems = () => {
    if (!serviceData.items) return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return serviceData.items;

    if (serviceKey === 'airport') {
      return serviceData.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          t(item.name).toLowerCase().includes(query) ||
          t(item.city).toLowerCase().includes(query)
      );
    }

    // localRides and outstation — items are strings
    return serviceData.items.filter((item) =>
      item.toLowerCase().includes(query) ||
      t(item).toLowerCase().includes(query)
    );
  };

  // ---- Render Search List Mode (airport, localRides, outstation) ----
  const renderSearchMode = () => {
    const filtered = getFilteredItems();

    return (
      <>
        <div className="smodal__search">
          <i className="fas fa-search smodal__search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="smodal__search-input"
            placeholder={t(serviceData.searchPlaceholder) || t('Search...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="smodal__search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              type="button"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="smodal__list">
          {filtered.length === 0 ? (
            <div className="smodal__empty">
              <i className="fas fa-search smodal__empty-icon" />
              <p>{t('No results found')}</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div className="smodal__list-item" key={idx}>
                <div className="smodal__item-info">
                  {serviceKey === 'airport' ? (
                    <>
                      <span className="smodal__item-name">{t(item.name)}</span>
                      <span className="smodal__item-city">{t(item.city)}</span>
                    </>
                  ) : (
                    <span className="smodal__item-name">{t(item)}</span>
                  )}
                </div>
                <a
                  href={getWhatsAppUrl(serviceKey, item, t, language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="smodal__book-btn"
                >
                  {t('Book Now')}
                </a>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  // ---- Render Temple Packages Mode ----
  const renderTempleMode = () => {
    const packages = serviceData.packages || [];

    return (
      <div className="smodal__packages">
        {packages.map((pkg, idx) => {
          const isOpen = activePackageIndex === idx;

          return (
            <div
              className={`smodal__package ${isOpen ? 'smodal__package--open' : ''}`}
              key={idx}
            >
              <button
                className="smodal__package-header"
                onClick={() => togglePackage(idx)}
                aria-expanded={isOpen}
                type="button"
              >
                <span className="smodal__package-name">{t(pkg.name)}</span>
                <i
                  className={`fas fa-chevron-down smodal__package-chevron ${isOpen ? 'smodal__package-chevron--open' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="smodal__package-body">
                  <ul className="smodal__temples-list">
                    {pkg.temples.map((temple, tIdx) => (
                      <li className="smodal__temple-item" key={tIdx}>
                        <i className="fas fa-om smodal__temple-bullet" />
                        <span>{t(temple)}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={getPackageWhatsAppUrl(pkg.name, t, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="smodal__package-book"
                  >
                    <i className="fab fa-whatsapp" />
                    {t('Book Package')}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="smodal__overlay" onClick={handleBackdropClick}>
      <div
        className="smodal__card"
        ref={modalRef}
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-label={t(serviceData.title)}
      >
        {/* Header */}
        <header className="smodal__header">
          <div className="smodal__header-left">
            <div className="smodal__header-icon">
              <i className={`fas fa-${serviceData.icon}`} />
            </div>
            <h3 className="smodal__header-title">{t(serviceData.title)}</h3>
          </div>
          <button
            className="smodal__close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <i className="fas fa-times" />
          </button>
        </header>

        {/* Content */}
        <div className="smodal__content">
          {isTemple ? renderTempleMode() : renderSearchMode()}
        </div>
      </div>
    </div>
  );
}
