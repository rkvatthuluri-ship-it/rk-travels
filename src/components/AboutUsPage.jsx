import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import WhyChoose from './WhyChoose';
import Founder from './Founder';
import './AboutUsPage.css';

export default function AboutUsPage() {
  const { t } = useLanguage();

  useEffect(() => {
    // Scroll to top when this page mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ap-page">
      {/* Page Header Banner */}
      <header className="ap-banner">
        <div className="ap-banner-glow" />
        <div className="ap-banner-content">
          <h1 className="ap-banner-title">{t('About Our Service')}</h1>
          <p className="ap-banner-desc">
            {t('Reliable taxi services in Vijayawada with professional drivers and clean cars.')}
          </p>
        </div>
      </header>

      {/* Embedded Sub-sections */}
      <div className="ap-sections">
        <WhyChoose />
        <Founder />
      </div>
    </div>
  );
}
