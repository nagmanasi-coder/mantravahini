"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '@/lib/translations';

type Language = 'kn' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('kn');

  useEffect(() => {
    // You can add logic here to get language from localStorage or browser settings
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['kn', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'kn' ? 'en' : 'kn';
      localStorage.setItem('language', newLang);
      if (document.documentElement.lang !== newLang) {
          document.documentElement.lang = newLang;
      }
      return newLang;
    });
  };

  const t = (key: keyof typeof translations.en): string => {
    // Ensure key is a valid key for both languages
    if (key in translations.kn && key in translations.en) {
        return translations[language][key as keyof typeof translations.kn];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
