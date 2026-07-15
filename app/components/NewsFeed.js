'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { t, translateCategoryName } from '../../lib/i18n';
import { timeAgo, exactTime } from '../../lib/format';
import ArticleModal from './ArticleModal';

const SOURCE_NAMES = ['РИА Новости', 'ТАСС', 'Lenta.ru', 'Коммерсантъ', 'BBC Russian'];

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

// Клик по заголовку открывает превью на сайте; Ctrl/Cmd/средняя кнопка — как обычно, в новой вкладке
function useHeadlineClick(setOpenItem) {
  return (e, item) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setOpenItem(item);
  };
}

export default function NewsFeed({ category }) {
  const { items, trending, loading } = useNews();
  const { lang, translateItem, ensureTranslated } = useLanguage();
  const [activeSource, setActiveSource] = useState('Все');
  const [search, setSearch] = useState('');
  const [openItem, setOpenItem] = useState(null);
  const handleHeadlineClick = useHeadlineClick(setOpenItem);

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
  const rest = afterTop.slice(3);

  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, activeSource, search]);

  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  const showTrending = isHome && !hasSearch && trending && trending.length > 0;

  useEffect(() => {
    if (lang !== 'en') return;
    const visible = [lead, second, third, ...readAlso, ...visibleRest, ...(showTrending ? trending.map((c) => c.item) : [])].filter(Boolean);
    ensureTranslated(visible);
  }, [lang, lead, second, third, readAlso, visibleRest, showTrending, trending, ensureTranslated]);

  const L = lead ? translateItem(lead) : null;
  const S = second ? translateItem(second) : null;
  const T3 = third ? translateItem(third) : null;
  const modalItem = openItem ? translateItem(openItem) : null;

  const relatedItems = useMemo(() => {
    if (!openItem) return [];
    return items
      .filter((i) => i.category === openItem.category && i.link !== openItem.link)
      .slice(0, 3)
      .map((i) => translateItem(i));
  }, [openItem, items, translateItem]);

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
                    <h2><a href={L.link} onClick={(e) => handleHeadlineClick(e, L)}>{L.title}</a></h2>
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
                        <h3><a href={i.link} onClick={(e) => handleHeadlineClick(e, i)}>{i.title}</a></h3>
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
                          <a href={i.link} onClick={(e) => handleHeadlineClick(e, i)}>{i.title}</a>
                          <span className="read-also-source">{i.source}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="grid">
                {visibleRest.map((raw, idx) => {
                  const i = translateItem(raw);
                  return (
                    <div className="card" key={idx}>
                      <ImageBlock item={i} className="card-img" />
                      <div className="tag" style={{ color: i.color }}>{i.source}</div>
                      <h3><a href={i.link} onClick={(e) => handleHeadlineClick(e, i)}>{i.title}</a></h3>
                      {i.excerpt && <p>{i.excerpt}…</p>}
                      <div className="meta" title={exactTime(i.pubDate, lang)}>{timeAgo(i.pubDate, lang)}</div>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="load-more-row">
                  <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                    {t('loadMore', lang)}
                  </button>
                </div>
              )}
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
                      <a href={i.link} onClick={(e) => handleHeadlineClick(e, i)}>{i.title}</a>
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

      <ArticleModal
        item={modalItem}
        lang={lang}
        relatedItems={relatedItems}
        onClose={() => setOpenItem(null)}
        onOpenRelated={(r) => setOpenItem(r)}
      />
    </>
  );
}
