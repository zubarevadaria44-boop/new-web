'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { t, translateCategoryName } from '../../lib/i18n';

const SOURCE_NAMES = ['РИА Новости', 'ТАСС', 'Lenta.ru', 'Коммерсантъ', 'BBC Russian'];

function timeAgo(dateStr, lang) {
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return '';
  const diffMin = Math.floor((Date.now() - then) / 60000);
  if (lang === 'en') {
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return diffMin + ' min ago';
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return diffH + ' h ago';
    return Math.floor(diffH / 24) + ' d ago';
  }
  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return diffMin + ' мин назад';
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return diffH + ' ч назад';
  return Math.floor(diffH / 24) + ' дн назад';
}

function exactTime(dateStr, lang) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
}

function ImageBlock({ item, className }) {
  if (item.image) {
    return <div className={className} style={{ backgroundImage: `url('${item.image}')` }} />;
  }
  return (
    <div className={`${className} placeholder`}>
      <span>{item.source.charAt(0)}</span>
    </div>
  );
}

export default function NewsFeed({ category }) {
  const { items, trending, loading } = useNews();
  const { lang, translateItem, ensureTranslated } = useLanguage();
  const [activeSource, setActiveSource] = useState('Все');
  const [search, setSearch] = useState('');

  const isHome = category === 'Главное';
  const hasSearch = search.trim().length > 0;

  const baseList = useMemo(
    () => (isHome ? items : items.filter((i) => i.category === category)),
    [items, category, isHome]
  );

  const availableSources = useMemo(
    () => SOURCE_NAMES.filter((n) => baseList.some((i) => i.source === n)),
    [baseList]
  );

  const filtered = useMemo(() => {
    let list = baseList;
    if (activeSource !== 'Все') list = list.filter((i) => i.source === activeSource);
    if (hasSearch) {
      list = list.filter((i) => i.title.toLowerCase().includes(search.trim().toLowerCase()));
    } else if (isHome) {
      list = list.slice(0, 18);
    }
    return list;
  }, [baseList, activeSource, search, isHome, hasSearch]);

  useEffect(() => {
    if (activeSource !== 'Все' && !availableSources.includes(activeSource)) {
      setActiveSource('Все');
    }
  }, [availableSources, activeSource]);

  const [lead, second, third, ...afterTop] = filtered;
  const readAlso = afterTop.slice(0, 3);
  const rest = afterTop.slice(3, 23);

  const showTrending = isHome && !hasSearch && trending && trending.length > 0;

  // Переводим только то, что реально видно на экране прямо сейчас
  useEffect(() => {
    if (lang !== 'en') return;
    const visible = [lead, second, third, ...readAlso, ...rest, ...(showTrending ? trending.map((c) => c.item) : [])].filter(Boolean);
    ensureTranslated(visible);
  }, [lang, lead, second, third, readAlso, rest, showTrending, trending, ensureTranslated]);

  const L = lead ? translateItem(lead) : null;
  const S = second ? translateItem(second) : null;
  const T3 = third ? translateItem(third) : null;

  return (
    <>
      <div className="controls">
        <div className="tabs">
          {['Все', ...availableSources].map((n) => (
            <button
              key={n}
              className={`tab ${n === activeSource ? 'active' : ''}`}
              onClick={() => setActiveSource(n)}
            >
              {n === 'Все' ? t('all', lang) : n}
            </button>
          ))}
        </div>
        <input
          className="searchbox"
          placeholder={t('searchPlaceholder', lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className={showTrending ? 'with-sidebar' : ''}>
        <div className="feed-column">
          <div className="section-label">{isHome ? t('hotNews', lang) : translateCategoryName(category, lang)}</div>
          {!filtered.length ? (
            <div className="empty">
              {loading ? t('emptyLoading', lang) : t('emptyNoResults', lang)}
            </div>
          ) : (
            <>
              <div className="hero-row">
                <div className="hero-lead">
                  <ImageBlock item={L} className="img" />
                  <div>
                    <div className="tag" style={{ color: L.color }}>{L.source}</div>
                    <h2><a href={L.link} target="_blank" rel="noopener noreferrer">{L.title}</a></h2>
                    {L.excerpt && <p>{L.excerpt}…</p>}
                    <div className="meta" title={exactTime(L.pubDate, lang)}>{timeAgo(L.pubDate, lang)}</div>
                  </div>
                </div>
                <div className="hero-secondary">
                  {[S, T3].filter(Boolean).map((i, idx) => (
                    <div className="hero-sec-item" key={idx}>
                      <ImageBlock item={i} className="hero-sec-img" />
                      <div>
                        <div className="tag" style={{ color: i.color }}>{i.source}</div>
                        <h3><a href={i.link} target="_blank" rel="noopener noreferrer">{i.title}</a></h3>
                        <div className="meta" title={exactTime(i.pubDate, lang)}>{timeAgo(i.pubDate, lang)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {readAlso.length > 0 && (
                <div className="read-also">
                  <span className="read-also-label">{t('readAlso', lang)}</span>
                  <ul>
                    {readAlso.map((raw, idx) => {
                      const i = translateItem(raw);
                      return (
                        <li key={idx}>
                          <a href={i.link} target="_blank" rel="noopener noreferrer">{i.title}</a>
                          <span className="read-also-source">{i.source}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="grid">
                {rest.map((raw, idx) => {
                  const i = translateItem(raw);
                  return (
                    <div className="card" key={idx}>
                      <ImageBlock item={i} className="card-img" />
                      <div className="tag" style={{ color: i.color }}>{i.source}</div>
                      <h3><a href={i.link} target="_blank" rel="noopener noreferrer">{i.title}</a></h3>
                      {i.excerpt && <p>{i.excerpt}…</p>}
                      <div className="meta" title={exactTime(i.pubDate, lang)}>{timeAgo(i.pubDate, lang)}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {showTrending && (
          <aside className="trending">
            <div className="trending-title">{t('trending', lang)}</div>
            <ol>
              {trending.map((cluster, idx) => {
                const i = translateItem(cluster.item);
                return (
                  <li key={idx}>
                    <span className="trending-rank">{idx + 1}</span>
                    <div>
                      <a href={i.link} target="_blank" rel="noopener noreferrer">{i.title}</a>
                      <div className="trending-sources">
                        {t('coveredBy', lang, cluster.sourcesCount, cluster.sources.join(', '))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </aside>
        )}
      </main>
    </>
  );
}
