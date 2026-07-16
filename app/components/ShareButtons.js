'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../../lib/i18n';

export default function ShareButtons({ url, title }) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard?.writeText(url).then(() => setCopied(true));
  }

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="article-modal-share">
      <button onClick={copyLink}>{copied ? t('copied', lang) : t('copyLink', lang)}</button>
      <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer">Telegram</a>
    </div>
  );
}
