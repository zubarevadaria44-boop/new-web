import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import SiteChrome from './components/SiteChrome';

const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://new-web-tan-omega.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Полдень — самарский городской журнал',
  description: 'Авторские материалы о жизни Самары: события, места, люди',
  openGraph: {
    title: 'Полдень — самарский городской журнал',
    description: 'Авторские материалы о жизни Самары: события, места, люди',
    siteName: 'Полдень',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Полдень — самарский городской журнал',
    description: 'Авторские материалы о жизни Самары: события, места, люди',
  },
};

async function fetchCurrency() {
  try {
    const res = await fetch('https://www.cbr-xml-daily.ru/daily_json.js', { next: { revalidate: 300 } });
    const data = await res.json();
    return {
      usd: data?.Valute?.USD?.Value ? Number(data.Valute.USD.Value.toFixed(2)) : null,
      eur: data?.Valute?.EUR?.Value ? Number(data.Valute.EUR.Value.toFixed(2)) : null,
    };
  } catch (e) {
    return { usd: null, eur: null };
  }
}

export const revalidate = 300;

export default async function RootLayout({ children }) {
  const currency = await fetchCurrency();

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
          <SiteChrome currency={currency}>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
