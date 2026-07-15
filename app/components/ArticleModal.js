'use client';

import { exactTime } from '../../lib/format';

export default function ArticleModal({ item, lang, onClose }) {
  if (!item) return null;

  const ctaLabel = lang === 'en' ? `Read full article on ${item.source}` : `Читать полностью на ${item.source}`;

  return (
    <div className="article-overlay" onClick={onClose}>
      <div className="article-modal" onClick={(e) => e.stopPropagation()}>
        <button className="article-close" onClick={onClose} aria-label={lang === 'en' ? 'Close' : 'Закрыть'}>✕</button>

        {item.image ? (
          <div className="article-modal-img" style={{ backgroundImage: `url('${item.image}')` }} />
        ) : (
          <div className="article-modal-img placeholder"><span>{item.source.charAt(0)}</span></div>
        )}

        <div className="article-modal-body">
          <div className="tag" style={{ color: item.color }}>{item.source}</div>
          <h2>{item.title}</h2>
          <div className="meta">{exactTime(item.pubDate, lang)}</div>
          {item.excerpt && <p>{item.excerpt}…</p>}
          <a className="article-modal-cta" href={item.link} target="_blank" rel="noopener noreferrer">
            {ctaLabel} →
          </a>
        </div>
      </div>
    </div>
  );
}
