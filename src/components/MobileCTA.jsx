import { useLanguage } from '../context/LanguageContext';
import './MobileCTA.css';

export default function MobileCTA() {
  const { t } = useLanguage();

  return (
    <>
      <a
        href="https://wa.me/919391089897?text=Hello%20Rama%20Krishna,%20I%20want%20to%20book%20a%20cab."
        className="mcta-bar"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp"></i>
        <span>{t('Book via WhatsApp')}</span>
      </a>
      {/* Spacer to prevent content from being hidden behind the fixed bar */}
      <div className="mcta-spacer"></div>
    </>
  );
}
