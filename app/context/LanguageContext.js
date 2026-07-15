'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru');
  // Кэш переводов: link -> { title, excerpt }
  const [translations, setTranslations] = useState({});
  const pending = useRef(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('poldnen-lang');
    if (saved === 'en') setLang('en');
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'ru' ? 'en' : 'ru';
      localStorage.setItem('poldnen-lang', next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  // Переводит только те новости из списка, которых ещё нет в кэше
  const ensureTranslated = useCallback(
    async (items) => {
      if (lang !== 'en' || !items.length) return;
      const toTranslate = items.filter(
        (i) => !translations[i.link] && !pending.current.has(i.link)
      );
      if (!toTranslate.length) return;

      toTranslate.forEach((i) => pending.current.add(i.link));

      const texts = [];
      toTranslate.forEach((i) => {
        texts.push(i.title);
        texts.push(i.excerpt || '');
      });

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts, target: 'en' }),
        });
        const data = await res.json();
        const out = data.translations || [];
        setTranslations((prev) => {
          const next = { ...prev };
          toTranslate.forEach((item, idx) => {
            next[item.link] = {
              title: out[idx * 2] || item.title,
              excerpt: out[idx * 2 + 1] || item.excerpt,
            };
          });
          return next;
        });
      } catch (e) {
        // молча оставляем оригинал — обработается через fallback при рендере
      } finally {
        toTranslate.forEach((i) => pending.current.delete(i.link));
      }
    },
    [lang, translations]
  );

  const translateItem = useCallback(
    (item) => {
      if (lang !== 'en') return item;
      const tr = translations[item.link];
      return tr ? { ...item, title: tr.title, excerpt: tr.excerpt } : item;
    },
    [lang, translations]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, ensureTranslated, translateItem }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
