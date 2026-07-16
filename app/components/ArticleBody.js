'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { translateCategoryName } from '../../lib/i18n';
import { exactTime } from '../../lib/format';

export default function ArticleBody({ article }) {
  const { lang, translateItem, ensureTranslated } = useLanguage();

  const fullText = article.body.join(' ');

  useEffect(() => {
    if (lang !== 'en') return;
    ensureTranslated([{ link: article.slug, title: article.title, excerpt: fullText }]);
  }, [lang, article.slug, article.title, fullText, ensureTranslated]);

  const translated = translateItem({ link: article.slug, title: article.title, excerpt: fullText });
  const paragraphs = lang === 'en' && translated.excerpt !== fullText ? translated.excerpt.split(/(?<=[.!?])\s+(?=[A-ZА-Я])/) : article.body;

  return (
    <>
      <div className="tag">{translateCategoryName(article.category, lang)}</div>
      <h1>{translated.title}</h1>
      <div className="meta">{exactTime(article.pubDate, lang)}</div>
      <div className="article-body-text">
        {paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}
      </div>
    </>
  );
}
