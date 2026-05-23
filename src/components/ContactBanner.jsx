import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ContactBanner.css';

export default function ContactBanner() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cb-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = sectionRef.current?.querySelectorAll('.cb-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cb-section" id="contact" ref={sectionRef}>
      <div className="cb-grid">
        {/* Call Card */}
        <a href="tel:+919391089897" className="cb-card cb-card--call cb-animate">
          <div className="cb-icon-wrapper cb-icon-wrapper--gold">
            <i className="fas fa-headset"></i>
          </div>
          <p className="cb-label">{t('Need Help?')}</p>
          <p className="cb-subtitle">{t("We're just a call away!")}</p>
          <p className="cb-highlight cb-highlight--gold">+91 93910 89897</p>
          <p className="cb-action">{t('Call Rama Krishna')}</p>
        </a>

        {/* WhatsApp Card */}
        <a
          href="https://wa.me/919391089897?text=Hello%20Rama%20Krishna,%20I%20want%20to%20book%20a%20cab."
          className="cb-card cb-card--whatsapp cb-animate"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="cb-icon-wrapper cb-icon-wrapper--green">
            <i className="fab fa-whatsapp"></i>
          </div>
          <p className="cb-label">{t('Quick Booking')}</p>
          <p className="cb-subtitle">{t('Instant confirmation on WhatsApp chat')}</p>
          <p className="cb-highlight cb-highlight--green">{t('Book via WhatsApp')}</p>
          <p className="cb-action">{t('Book via WhatsApp')}</p>
        </a>

        {/* Email Card */}
        <a href="mailto:rkcabsvijayawada@gmail.com" className="cb-card cb-card--email cb-animate">
          <div className="cb-icon-wrapper cb-icon-wrapper--blue">
            <i className="fas fa-envelope"></i>
          </div>
          <p className="cb-label">{t('Email Us')}</p>
          <p className="cb-subtitle">{t('Send an email for queries & bookings')}</p>
          <p className="cb-highlight cb-highlight--email">rkcabsvijayawada@gmail.com</p>
          <p className="cb-action">{t('Send Email')}</p>
        </a>
      </div>
    </section>
  );
}
