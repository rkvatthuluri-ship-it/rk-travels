import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="ft-footer">
      {/* ── Golden temple skyline SVG ──────────────── */}
      <div className="ft-skyline" aria-hidden="true">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyGold1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2C94C" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#F2C94C" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="skyGold2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2C94C" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F2C94C" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background buildings */}
          <path
            fill="url(#skyGold1)"
            d="M0,120 L0,90 L40,90 L40,70 L60,70 L60,80 L100,80 L100,60 L120,60 L120,50 L140,50 L140,65 L180,65 L180,75 L220,75 L220,55 L240,55 L240,45 L260,45 L260,60 L300,60 L300,70 L340,70 L340,50 L360,50 L360,40 L380,40 L380,55 L420,55 L420,65 L460,65 L460,80 L500,80 L500,60 L520,60 L520,50 L540,50 L540,70 L580,70 L580,80 L620,80 L620,55 L640,55 L640,45 L660,45 L660,60 L700,60 L700,75 L740,75 L740,65 L780,65 L780,50 L800,50 L800,40 L820,40 L820,55 L860,55 L860,70 L900,70 L900,80 L940,80 L940,60 L960,60 L960,50 L980,50 L980,65 L1020,65 L1020,75 L1060,75 L1060,55 L1080,55 L1080,45 L1100,45 L1100,60 L1140,60 L1140,80 L1180,80 L1180,90 L1200,90 L1200,120 Z"
          />

          {/* Foreground temple gopurams */}
          <path
            fill="url(#skyGold2)"
            d="M0,120 L0,95 L80,95 L80,85 L120,85 L120,75 L140,60 L148,40 L152,30 L156,20 L160,15 L164,20 L168,30 L172,40 L180,60 L200,75 L200,85 L240,85 L240,95 L320,95 L320,80 L340,80 L340,70 L360,55 L368,40 L372,30 L376,25 L380,30 L384,40 L392,55 L400,65 L410,70 L410,80 L440,80 L440,95 L560,95 L560,85 L580,85 L580,70 L596,55 L600,40 L604,30 L608,25 L612,30 L616,40 L620,55 L636,70 L636,85 L660,85 L660,95 L780,95 L780,80 L800,80 L810,65 L818,45 L822,35 L826,28 L830,35 L834,45 L842,65 L852,80 L852,80 L880,80 L880,95 L960,95 L960,85 L980,85 L988,70 L994,50 L998,38 L1002,32 L1006,38 L1010,50 L1016,70 L1024,85 L1040,85 L1040,95 L1200,95 L1200,120 Z"
          />
        </svg>
      </div>

      {/* ── Footer content ─────────────────────────── */}
      <div className="ft-content">
        <div className="ft-brand">
          <div className="ft-logo">
            <i className="fas fa-taxi"></i>
            <span>RK CABS</span>
          </div>
          <p className="ft-tagline">{t('Your Journey, Elevated.')}</p>
          
          <div className="ft-contact-info">
            <p>
              <i className="fas fa-phone-alt"></i> +91 93910 89897
            </p>
            <p>
              <i className="fas fa-envelope"></i> rkcabsvijayawada@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────── */}
      <div className="ft-bottom">
        <p className="ft-copy">
          &copy; 2026 RK Cabs. {t('All Rights Reserved.')}
        </p>
        <div className="ft-socials">
          <a
            href="https://www.facebook.com/rk_cabs_vijayawada/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://www.instagram.com/rk_cabs_vijayawada/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://wa.me/919391089897"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
