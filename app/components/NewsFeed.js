'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { t, translateCategoryName } from '../../lib/i18n';
import { timeAgo, exactTime } from '../../lib/format';

function ImageBlock({ item, className }) {
  if (item.image) {
    return <div className={className} style={{ backgroundImage: `url('${item.image}')` }} />;
  }
  return (
    <div className={`${className} placeholder`}>
      <span>{item.title.charAt(0)}</span>
    </div>
  );
}

export default function NewsFeed({ category, articles }) {
  const { lang, translateItem, ensureTranslated } = useLanguage();
  const [search, setSearch] = useState('');

  const isHome = category === 'Главное';
  const hasSearch = search.trim().length > 0;

  const sorted = useMemo(
    () => [...articles].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)),
    [articles]
  );

  const filtered = useMemo(() => {
    if (!hasSearch) return sorted;
    return sorted.filter((i) => i.title.toLowerCase().includes(search.trim().toLowerCase()));
  }, [sorted, search, hasSearch]);

  const [lead, second, third, ...afterTop] = filtered;
  const readAlso = afterTop.slice(0, 3);
  const rest = afterTop.slice(3);

  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, search]);

  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  useEffect(() => {
    if (lang !== 'en') return;
    const visible = [lead, second, third, ...readAlso, ...visibleRest].filter(Boolean);
    ensureTranslated(visible.map((a) => ({ ...a, link: a.slug })));
  }, [lang, lead, second, third, readAlso, visibleRest, ensureTranslated]);

  function withTranslation(article) {
    if (!article) return null;
    const translated = translateItem({ ...article, link: article.slug });
    return { ...article, title: translated.title, excerpt: translated.excerpt };
  }

  const L = withTranslation(lead);
  const S = withTranslation(second);
  const T3 = withTranslation(third);

  return (
    <>
      <div className="controls">
        <div className="section-label-inline">{isHome ? t('hotNews', lang) : translateCategoryName(category, lang)}</div>
        <input
          className="searchbox"
          placeholder={t('searchPlaceholder', lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main>
        <div className="feed-column">
          {!filtered.length ? (
            <div className="empty">{t('emptyNoResults', lang)}</div>
          ) : (
            <>
              <div className="hero-row">
                <div className="hero-lead">
                  <Link href={`/article/${L.slug}`}>
                    <ImageBlock item={L} className="img" />
                  </Link>
                  <div>
                    <div className="tag">{translateCategoryName(L.category, lang)}</div>
                    <h2><Link href={`/article/${L.slug}`}>{L.title}</Link></h2>
                    {L.excerpt && <p>{L.excerpt}…</p>}
                    <div className="meta" title={exactTime(L.pubDate, lang)}>{timeAgo(L.pubDate, lang)}</div>
                  </div>
                </div>
                <div className="hero-secondary">
                  {[S, T3].filter(Boolean).map((i, idx) => (
                    <div className="hero-sec-item" key={idx}>
                      <Link href={`/article/${i.slug}`}>
                        <ImageBlock item={i} className="hero-sec-img" />
                      </Link>
                      <div>
                        <div className="tag">{translateCategoryName(i.category, lang)}</div>
                        <h3><Link href={`/article/${i.slug}`}>{i.title}</Link></h3>
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
                      const i = withTranslation(raw);
                      return (
                        <li key={idx}>
                          <Link href={`/article/${i.slug}`}>{i.title}</Link>
                          <span className="read-also-source">{translateCategoryName(i.category, lang)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="grid">
                {visibleRest.map((raw, idx) => {
                  const i = withTranslation(raw);
                  return (
                    <div className="card" key={idx}>
                      <Link href={`/article/${i.slug}`}>
                        <ImageBlock item={i} className="card-img" />
                      </Link>
                      <div className="tag">{translateCategoryName(i.category, lang)}</div>
                      <h3><Link href={`/article/${i.slug}`}>{i.title}</Link></h3>
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
      </main>
    </>
  );
}
