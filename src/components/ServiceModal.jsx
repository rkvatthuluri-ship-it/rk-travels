import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { services } from '../data/services';
import './ServiceModal.css';

const WHATSAPP_BASE = 'https://wa.me/919391089897?text=';

function getWhatsAppUrl(serviceKey, item, t, language, sourceLocation, airportTransferType, airportCity) {
  let message = '';

  if (language === 'te') {
    switch (serviceKey) {
      case 'airport':
        if (airportTransferType === 'pickup') {
          message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(item.name)} (${t(item.city)}) నుండి ${t(airportCity)} కి ఎయిర్‌పోర్ట్ పికప్ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        } else {
          message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(airportCity)} నుండి ${t(item.name)} (${t(item.city)}) కి ఎయిర్‌పోర్ట్ డ్రాప్ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        }
        break;
      case 'localRides':
        message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(item)} లో లోకల్ సిటీ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        break;
      case 'outstation':
        if (sourceLocation && sourceLocation.trim() !== '') {
          message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(sourceLocation)} నుండి ${t(item)} కి అవుట్‌స్టేషన్ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        } else {
          message = `నమస్కారం రామకృష్ణ గారు, నేను ${t(item)} కి అవుట్‌స్టేషన్ క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.`;
        }
        break;
      default:
        message = 'నమస్కారం రామకృష్ణ గారు, నేను ఒక క్యాబ్ బుక్ చేసుకోవాలనుకుంటున్నాను.';
    }
  } else {
    switch (serviceKey) {
      case 'airport':
        if (airportTransferType === 'pickup') {
          message = `Hi Rama Krishna, I want to book an Airport Pickup from ${item.name}, ${item.city} to ${airportCity}.`;
        } else {
          message = `Hi Rama Krishna, I want to book an Airport Drop from ${airportCity} to ${item.name}, ${item.city}.`;
        }
        break;
      case 'localRides':
        message = `Hi Rama Krishna, I want to book a Local City Ride in ${item}.`;
        break;
      case 'outstation':
        if (sourceLocation && sourceLocation.trim() !== '') {
          message = `Hi Rama Krishna, I want to book an Outstation Trip from ${sourceLocation} to ${item}.`;
        } else {
          message = `Hi Rama Krishna, I want to book an Outstation Trip to ${item}.`;
        }
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
  const [sourceLocation, setSourceLocation] = useState('');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [activePackageIndex, setActivePackageIndex] = useState(null);
  
  // Airport custom states
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [airportTransferType, setAirportTransferType] = useState('pickup');
  const [airportCity, setAirportCity] = useState('');
  const [showAirportCityDropdown, setShowAirportCityDropdown] = useState(false);

  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const sourceInputRef = useRef(null);
  const sourceContainerRef = useRef(null);
  const airportCityInputRef = useRef(null);
  const airportCityContainerRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sourceContainerRef.current && !sourceContainerRef.current.contains(e.target)) {
        setShowSourceDropdown(false);
      }
      if (airportCityContainerRef.current && !airportCityContainerRef.current.contains(e.target)) {
        setShowAirportCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Auto-focus input on mount
  useEffect(() => {
    if (!isTemple) {
      if (serviceKey === 'outstation' && sourceInputRef.current) {
        sourceInputRef.current.focus();
      } else if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [isTemple, serviceKey]);

  // Handle backdrop click
  const handleBackdropClick = () => onClose();
  const handleModalClick = (e) => e.stopPropagation();

  // Toggle package expansion (accordion mode: only one open at a time)
  const togglePackage = (index) => {
    setActivePackageIndex((prev) => (prev === index ? null : index));
  };

  // Filter options for the "From" source location dropdown
  const getSourceDropdownOptions = () => {
    if (!serviceData.items) return [];
    const query = sourceLocation.toLowerCase().trim();
    if (!query) return serviceData.items;
    return serviceData.items.filter((item) =>
      item.toLowerCase().includes(query) ||
      t(item).toLowerCase().includes(query)
    );
  };

  // Filter options for the "Airport City" dropdown (pickup or drop)
  const getAirportCityDropdownOptions = () => {
    const localCities = services?.localRides?.items || [];
    const query = airportCity.toLowerCase().trim();
    if (!query) return localCities;
    return localCities.filter((item) =>
      item.toLowerCase().includes(query) ||
      t(item).toLowerCase().includes(query)
    );
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

  // ---- Render Airport Booking Form ----
  const renderAirportForm = () => {
    const isBookDisabled = !airportCity.trim();
    const cityOptions = getAirportCityDropdownOptions();

    return (
      <div className="smodal__airport-form">
        {/* Selected Airport Card Info */}
        <div className="smodal__airport-info">
          <button
            className="smodal__back-btn"
            onClick={() => {
              setSelectedAirport(null);
              setAirportCity('');
            }}
            type="button"
            aria-label="Back to airport list"
          >
            <i className="fas fa-arrow-left" />
          </button>
          <div className="smodal__airport-details">
            <span className="smodal__airport-label">{t('Selected Airport')}</span>
            <h4 className="smodal__airport-name">{t(selectedAirport.name)}</h4>
            <span className="smodal__airport-city">{t(selectedAirport.city)}</span>
          </div>
        </div>

        {/* Transfer Type Selector (Tabs) */}
        <div className="smodal__tabs">
          <button
            className={`smodal__tab-btn ${airportTransferType === 'pickup' ? 'smodal__tab-btn--active' : ''}`}
            onClick={() => {
              setAirportTransferType('pickup');
              setTimeout(() => airportCityInputRef.current?.focus(), 50);
            }}
            type="button"
          >
            <i className="fas fa-plane-arrival" />
            {t('Airport Pickup')}
          </button>
          <button
            className={`smodal__tab-btn ${airportTransferType === 'drop' ? 'smodal__tab-btn--active' : ''}`}
            onClick={() => {
              setAirportTransferType('drop');
              setTimeout(() => airportCityInputRef.current?.focus(), 50);
            }}
            type="button"
          >
            <i className="fas fa-plane-departure" />
            {t('Airport Drop')}
          </button>
        </div>

        {/* City Input (Combobox dropdown) */}
        <div className="smodal__form-group">
          <label className="smodal__form-label">
            {airportTransferType === 'pickup' ? t('Drop-off City (To)') : t('Pickup City (From)')}
            <span className="smodal__required-mark">*</span>
          </label>
          <div className="smodal__route-field" ref={airportCityContainerRef}>
            <input
              ref={airportCityInputRef}
              type="text"
              className="smodal__route-input"
              placeholder={t('Enter city name...')}
              value={airportCity}
              onChange={(e) => {
                setAirportCity(e.target.value);
                setShowAirportCityDropdown(true);
              }}
              onFocus={() => setShowAirportCityDropdown(true)}
            />
            {airportCity ? (
              <button
                className="smodal__route-clear"
                onClick={() => {
                  setAirportCity('');
                  setShowAirportCityDropdown(false);
                }}
                aria-label="Clear location"
                type="button"
              >
                <i className="fas fa-times" />
              </button>
            ) : (
              <button
                className="smodal__route-dropdown-toggle"
                type="button"
                onClick={() => setShowAirportCityDropdown((prev) => !prev)}
                aria-label="Toggle city options"
              >
                <i className={`fas fa-chevron-down ${showAirportCityDropdown ? 'open' : ''}`} />
              </button>
            )}

            {showAirportCityDropdown && cityOptions.length > 0 && (
              <div className="smodal__dropdown-menu">
                {cityOptions.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    className="smodal__dropdown-item"
                    type="button"
                    onClick={() => {
                      setAirportCity(option);
                      setShowAirportCityDropdown(false);
                    }}
                  >
                    {t(option)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book CTA */}
        <a
          href={isBookDisabled ? undefined : getWhatsAppUrl(serviceKey, selectedAirport, t, language, sourceLocation, airportTransferType, airportCity)}
          target={isBookDisabled ? undefined : "_blank"}
          rel="noopener noreferrer"
          className={`smodal__package-book ${isBookDisabled ? 'smodal__book-btn--disabled' : ''}`}
          style={{ marginTop: '24px' }}
          onClick={(e) => {
            if (isBookDisabled) {
              e.preventDefault();
              if (airportCityInputRef.current) {
                airportCityInputRef.current.focus();
                airportCityInputRef.current.classList.add('smodal__route-input--error');
                setTimeout(() => airportCityInputRef.current.classList.remove('smodal__route-input--error'), 600);
              }
            }
          }}
        >
          <i className="fab fa-whatsapp" />
          {t('Book Now')}
        </a>
      </div>
    );
  };

  // ---- Render Search List Mode (airport, localRides, outstation) ----
  const renderSearchMode = () => {
    if (serviceKey === 'airport' && selectedAirport) {
      return renderAirportForm();
    }

    const filtered = getFilteredItems();
    const sourceOptions = getSourceDropdownOptions();
    const isBookDisabled = serviceKey === 'outstation' && !sourceLocation.trim();

    return (
      <>
        {serviceKey === 'outstation' ? (
          <div className="smodal__route-planner">
            <div className="smodal__route-indicators">
              <div className="smodal__route-dot smodal__route-dot--source" />
              <div className="smodal__route-line" />
              <div className="smodal__route-dot smodal__route-dot--dest" />
            </div>
            
            <div className="smodal__route-inputs">
              {/* Source Input */}
              <div className="smodal__route-field" ref={sourceContainerRef}>
                <input
                  ref={sourceInputRef}
                  type="text"
                  className="smodal__route-input"
                  placeholder={t('Enter source city (From)...')}
                  value={sourceLocation}
                  onChange={(e) => {
                    setSourceLocation(e.target.value);
                    setShowSourceDropdown(true);
                  }}
                  onFocus={() => setShowSourceDropdown(true)}
                />
                {sourceLocation ? (
                  <button
                    className="smodal__route-clear"
                    onClick={() => {
                      setSourceLocation('');
                      setShowSourceDropdown(false);
                    }}
                    aria-label="Clear source"
                    type="button"
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : (
                  <button
                    className="smodal__route-dropdown-toggle"
                    type="button"
                    onClick={() => setShowSourceDropdown((prev) => !prev)}
                    aria-label="Toggle source options"
                  >
                    <i className={`fas fa-chevron-down ${showSourceDropdown ? 'open' : ''}`} />
                  </button>
                )}

                {showSourceDropdown && sourceOptions.length > 0 && (
                  <div className="smodal__dropdown-menu">
                    {sourceOptions.map((option, oIdx) => (
                      <button
                        key={oIdx}
                        className="smodal__dropdown-item"
                        type="button"
                        onClick={() => {
                          setSourceLocation(option);
                          setShowSourceDropdown(false);
                        }}
                      >
                        {t(option)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Search */}
              <div className="smodal__route-field">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="smodal__route-input"
                  placeholder={t(serviceData.searchPlaceholder) || t('Search destinations (To)...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="smodal__route-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    type="button"
                  >
                    <i className="fas fa-times" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
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
        )}

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
                {serviceKey === 'airport' ? (
                  <button
                    className="smodal__book-btn"
                    onClick={() => {
                      setSelectedAirport(item);
                      setTimeout(() => airportCityInputRef.current?.focus(), 150);
                    }}
                    type="button"
                  >
                    {t('Book Now')}
                  </button>
                ) : (
                  <a
                    href={isBookDisabled ? undefined : getWhatsAppUrl(serviceKey, item, t, language, sourceLocation)}
                    target={isBookDisabled ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`smodal__book-btn ${isBookDisabled ? 'smodal__book-btn--disabled' : ''}`}
                    onClick={(e) => {
                      if (isBookDisabled) {
                        e.preventDefault();
                        const sourceInput = document.querySelector('.smodal__route-input');
                        if (sourceInput) {
                          sourceInput.focus();
                          sourceInput.classList.add('smodal__route-input--error');
                          setTimeout(() => sourceInput.classList.remove('smodal__route-input--error'), 600);
                        }
                      }
                    }}
                  >
                    {t('Book Now')}
                  </a>
                )}
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
