export function timeAgo(dateStr, lang) {
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

export function exactTime(dateStr, lang) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
}
