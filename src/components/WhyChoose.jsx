import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WhyChoose.css';

const features = [
  {
    icon: 'fa-shield-halved',
    title: 'Safe & Reliable',
    desc: 'Your safety is our highest priority. Regularly sanitized cabs and GPS tracked rides.',
  },
  {
    icon: 'fa-user-tie',
    title: 'Professional Drivers',
    desc: 'Experienced, polite, verified, and well-trained drivers for smooth travel.',
  },
  {
    icon: 'fa-hand-holding-dollar',
    title: 'Transparent Pricing',
    desc: 'No hidden charges or surge pricing. What you see is what you pay.',
  },
  {
    icon: 'fa-circle-check',
    title: '24/7 Availability',
    desc: 'Available whenever you need us. Booking services active around the clock.',
  },
];

export default function WhyChoose() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wc-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.wc-animate');
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="wc-section" id="why-choose" ref={sectionRef}>
      <div className="wc-header wc-animate">
        <h2 className="wc-title">{t('Why Choose RK Cabs?')}</h2>
        <div className="wc-divider">
          <span className="wc-divider-line"></span>
          <span className="wc-divider-dot"></span>
          <span className="wc-divider-line"></span>
        </div>
      </div>

      <div className="wc-grid">
        {features.map((f, i) => (
          <article
            className="wc-card wc-animate"
            key={f.title}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <i className={`fas ${f.icon} wc-card-icon`}></i>
            <h3 className="wc-card-title">{t(f.title)}</h3>
            <p className="wc-card-desc">{t(f.desc)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
