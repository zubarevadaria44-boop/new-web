import './globals.css';
import { fetchAllNews } from '../lib/news';
import { NewsProvider } from './context/NewsContext';
import { LanguageProvider } from './context/LanguageContext';
import SiteChrome from './components/SiteChrome';

const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://new-web-tan-omega.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Полдень — живая лента новостей',
  description: 'Живая новостная лента: РИА, ТАСС, Lenta.ru, Коммерсантъ, BBC Russian',
  openGraph: {
    title: 'Полдень — живая лента новостей',
    description: 'Живая новостная лента: РИА, ТАСС, Lenta.ru, Коммерсантъ, BBC Russian',
    siteName: 'Полдень',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Полдень — живая лента новостей',
    description: 'Живая новостная лента: РИА, ТАСС, Lenta.ru, Коммерсантъ, BBC Russian',
  },
};

export const revalidate = 300;

export default async function RootLayout({ children }) {
  const initialData = await fetchAllNews();

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <NewsProvider initialData={initialData}>
            <SiteChrome>{children}</SiteChrome>
          </NewsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
