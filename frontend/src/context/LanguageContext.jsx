import React, { createContext, useContext, useState, useEffect } from 'react';
import { az } from '../i18n/az';
import { en } from '../i18n/en';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'az');

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'az' ? 'en' : 'az'));
  };

  const t = (key, fallback = '') => {
    const dictionary = lang === 'az' ? az : en;
    return dictionary[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
