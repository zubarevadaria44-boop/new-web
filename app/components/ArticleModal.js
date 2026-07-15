'use client';

import { useEffect, useState } from 'react';
import { exactTime, hostnameOf } from '../../lib/format';

export default function ArticleModal({ item, lang, relatedItems, onClose, onOpenRelated }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [item]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (item) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;

  const ctaLabel = lang === 'en' ? `Read full article on ${item.source}` : `Читать полностью на ${item.source}`;
  const relatedLabel = lang === 'en' ? 'Related' : 'Похожие новости';
  const copyLabel = copied ? (lang === 'en' ? 'Copied ✓' : 'Скопировано ✓') : (lang === 'en' ? 'Copy link' : 'Скопировать ссылку');
  const telegramLabel = 'Telegram';

  function copyLink() {
    navigator.clipboard?.writeText(item.link).then(() => setCopied(true));
  }

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(item.link)}&text=${encodeURIComponent(item.title)}`;

  return (
    <div className="article-overlay" onClick={onClose}>
      <div className="article-modal" onClick={(e) => e.stopPropagation()}>
        <button className="article-close" onClick={onClose} aria-label={lang === 'en' ? 'Close' : 'Закрыть'}>✕</button>

        <div className="article-modal-hero" style={item.image ? { backgroundImage: `url('${item.image}')` } : undefined}>
          {!item.image && <span className="article-modal-hero-letter">{item.source.charAt(0)}</span>}
          <div className="article-modal-hero-overlay">
            <span className="article-modal-hero-tag" style={{ background: item.color }}>{item.source}</span>
          </div>
        </div>

        <div className="article-modal-body">
          <h2>{item.title}</h2>
          <div className="meta">{exactTime(item.pubDate, lang)}</div>
          {item.excerpt && <p>{item.excerpt}…</p>}

          <div className="article-modal-actions">
            <a className="article-modal-cta" href={item.link} target="_blank" rel="noopener noreferrer">
              {ctaLabel} →
            </a>
            <div className="article-modal-share">
              <button onClick={copyLink}>{copyLabel}</button>
              <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer">{telegramLabel}</a>
            </div>
          </div>
          <div className="article-modal-domain">{hostnameOf(item.link)}</div>

          {relatedItems && relatedItems.length > 0 && (
            <div className="article-modal-related">
              <span className="article-modal-related-label">{relatedLabel}</span>
              <ul>
                {relatedItems.map((r, idx) => (
                  <li key={idx}>
                    <a
                      href={r.link}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                        e.preventDefault();
                        onOpenRelated(r);
                      }}
                    >
                      {r.title}
                    </a>
                    <span className="article-modal-related-source">{r.source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
