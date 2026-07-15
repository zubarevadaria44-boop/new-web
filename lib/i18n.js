export const CATEGORY_TRANSLATIONS = {
  'Главное': 'Top news',
  'Мир': 'World',
  'Россия': 'Russia',
  'Бизнес': 'Business',
  'Технологии': 'Technology',
  'Наука': 'Science',
  'Спорт': 'Sport',
  'Культура': 'Culture',
  'Общество': 'Society',
};

export function translateCategoryName(name, lang) {
  if (lang !== 'en') return name;
  return CATEGORY_TRANSLATIONS[name] || name;
}

const DICT = {
  ru: {
    liveFeed: 'живая лента',
    hotNews: 'Горячие новости',
    trending: 'В тренде',
    readAlso: 'Читайте также',
    searchPlaceholder: 'Поиск по заголовкам…',
    all: 'Все',
    refreshNow: 'Обновить сейчас',
    updating: 'Обновляю новости…',
    loadedCount: (n) => `Загружено ${n} новостей`,
    lastUpdate: 'последнее обновление',
    notResponding: 'не отвечают',
    emptyLoading: 'Собираю свежие новости из нескольких источников…',
    emptyNoResults: 'Ничего не нашлось в этом разделе. Попробуйте другую категорию или запрос.',
    sectionsAria: 'Разделы',
    openMenu: 'Открыть меню разделов',
    close: 'Закрыть',
    updateEvery5: 'обновление каждые 5 минут',
    coveredBy: (n, sources) => `Пишут ${n} источника${n >= 5 ? 'ов' : n >= 2 ? 'а' : ''}: ${sources}`,
    switchTheme: 'Переключить тему',
    switchLang: 'Переключить язык',
    translating: 'переводим…',
    loadMore: 'Показать ещё',
  },
  en: {
    liveFeed: 'live feed',
    hotNews: 'Hot news',
    trending: 'Trending',
    readAlso: 'Read also',
    searchPlaceholder: 'Search headlines…',
    all: 'All',
    refreshNow: 'Refresh now',
    updating: 'Updating news…',
    loadedCount: (n) => `${n} articles loaded`,
    lastUpdate: 'last updated',
    notResponding: 'not responding',
    emptyLoading: 'Gathering fresh news from several sources…',
    emptyNoResults: 'Nothing found in this section. Try another category or search.',
    sectionsAria: 'Sections',
    openMenu: 'Open sections menu',
    close: 'Close',
    updateEvery5: 'updates every 5 minutes',
    coveredBy: (n, sources) => `Covered by ${n} source${n === 1 ? '' : 's'}: ${sources}`,
    switchTheme: 'Toggle theme',
    switchLang: 'Switch language',
    translating: 'translating…',
    loadMore: 'Load more',
  },
};

export function t(key, lang, ...args) {
  const entry = (DICT[lang] || DICT.ru)[key];
  if (typeof entry === 'function') return entry(...args);
  return entry || key;
}
