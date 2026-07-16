export const CATEGORY_TRANSLATIONS = {
  'Главное': 'Top news',
  'Новости': 'News',
  'Город': 'City',
  'Культура': 'Culture',
  'Еда': 'Food',
  'Путешествия': 'Travel',
  'Спорт': 'Sport',
};

export function translateCategoryName(name, lang) {
  if (lang !== 'en') return name;
  return CATEGORY_TRANSLATIONS[name] || name;
}

const DICT = {
  ru: {
    liveFeed: 'городской журнал',
    hotNews: 'Новые материалы',
    readAlso: 'Читайте также',
    searchPlaceholder: 'Поиск по заголовкам…',
    refreshNow: 'Обновить сейчас',
    emptyNoResults: 'В этом разделе пока ничего нет. Попробуйте другую категорию или запрос.',
    sectionsAria: 'Разделы',
    openMenu: 'Открыть меню разделов',
    close: 'Закрыть',
    switchTheme: 'Переключить тему',
    switchLang: 'Переключить язык',
    loadMore: 'Показать ещё',
    related: 'Похожие материалы',
    copyLink: 'Скопировать ссылку',
    copied: 'Скопировано ✓',
    backHome: '← Все материалы',
  },
  en: {
    liveFeed: 'city journal',
    hotNews: 'Latest stories',
    readAlso: 'Read also',
    searchPlaceholder: 'Search headlines…',
    refreshNow: 'Refresh now',
    emptyNoResults: 'Nothing here yet. Try another category or search.',
    sectionsAria: 'Sections',
    openMenu: 'Open sections menu',
    close: 'Close',
    switchTheme: 'Toggle theme',
    switchLang: 'Switch language',
    loadMore: 'Load more',
    related: 'Related stories',
    copyLink: 'Copy link',
    copied: 'Copied ✓',
    backHome: '← All stories',
  },
};

export function t(key, lang, ...args) {
  const entry = (DICT[lang] || DICT.ru)[key];
  if (typeof entry === 'function') return entry(...args);
  return entry || key;
}
