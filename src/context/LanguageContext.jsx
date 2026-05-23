import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('rk_cabs_lang');
      return saved === 'te' ? 'te' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((lang) => {
    const nextLang = lang === 'te' ? 'te' : 'en';
    setLanguageState(nextLang);
    try {
      localStorage.setItem('rk_cabs_lang', nextLang);
    } catch (e) {
      console.warn('Failed to save language setting', e);
    }
  }, []);

  // Sync document.documentElement.lang with state
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key) => {
    if (!key) return '';
    const dict = translations[language] || translations['en'];
    return dict[key] !== undefined ? dict[key] : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
