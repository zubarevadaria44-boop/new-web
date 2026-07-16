'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_ITEMS, ARTICLES } from '../../lib/articles';
import { t, translateCategoryName } from '../../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

function categoryNameForPath(pathname) {
  const item = NAV_ITEMS.find((n) => n.href === pathname);
  return item ? item.name : 'Главное';
}

export default function SiteChrome({ children, currency }) {
  const pathname = usePathname();
  const activeName = categoryNameForPath(pathname);
  const { lang, toggleLang } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clock, setClock] = useState('');
  const [dateLine, setDateLine] = useState('');
  const [theme, setTheme] = useState('light');

  const locale = lang === 'en' ? 'en-US' : 'ru-RU';

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }));
      setDateLine(now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }));
    }
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, [locale]);

  useEffect(() => {
    const saved = localStorage.getItem('poldnen-theme');
    if (saved === 'dark') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('poldnen-theme', next);
  }

  const counts = {};
  NAV_ITEMS.forEach((n) => {
    counts[n.name] = n.name === 'Главное' ? ARTICLES.length : ARTICLES.filter((a) => a.category === n.name).length;
  });

  const ticker = [...ARTICLES].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 14);

  return (
    <>
      <div className="masthead">
        <div className="masthead-left">
          <button className="menu-btn" aria-label={t('openMenu', lang)} onClick={() => setDrawerOpen(true)}>
            <span></span><span></span><span></span>
          </button>
          <div>
            <Link href="/"><h1>Полдень</h1></Link>
            <div className="sub">{dateLine ? `— ${dateLine} —` : `— ${t('liveFeed', lang)} —`}</div>
          </div>
        </div>
        <div className="masthead-right">
          {(currency?.usd || currency?.eur) && (
            <div className="currency">
              {currency.usd ? <span>$ {currency.usd.toFixed(2)}</span> : null}
              {currency.eur ? <span>€ {currency.eur.toFixed(2)}</span> : null}
            </div>
          )}
          <button className="lang-btn" onClick={toggleLang} aria-label={t('switchLang', lang)}>
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
          <button className="theme-btn" onClick={toggleTheme} aria-label={t('switchTheme', lang)}>
            {theme === 'dark' ? '☀︎' : '☾'}
          </button>
          <div className="clock">{lang === 'ru' ? 'сейчас' : 'now'}<span>{clock || '--:--'}</span></div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {ticker.map((i, idx) => <span key={idx}>{i.title}</span>)}
          {ticker.map((i, idx) => <span key={'b' + idx}>{i.title}</span>)}
        </div>
      </div>

      <div className={`overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <nav className={`drawer ${drawerOpen ? 'open' : ''}`} aria-label={t('sectionsAria', lang)}>
        <div className="drawer-top">
          <span className="drawer-logo">Полдень</span>
          <button className="close-btn" onClick={() => setDrawerOpen(false)} aria-label={t('close', lang)}>✕</button>
        </div>
        <ul className="drawer-list">
          {NAV_ITEMS.map((n) => (
            <li key={n.name}>
              <Link href={n.href} className={n.name === activeName ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
                <span>{translateCategoryName(n.name, lang)}</span>
                <span className="count">{counts[n.name] || 0}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="drawer-footer">Полдень — журнал о жизни Самары</div>
      </nav>

      {children}

      <footer>Полдень — самарский городской журнал · {ARTICLES.length} материалов</footer>
    </>
  );
}
