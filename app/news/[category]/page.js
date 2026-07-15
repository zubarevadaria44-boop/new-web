import { notFound } from 'next/navigation';
import { CATEGORY_LIST, slugToCategoryName } from '../../../lib/news';
import NewsFeed from '../../components/NewsFeed';

export function generateStaticParams() {
  return CATEGORY_LIST.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const name = slugToCategoryName(params.category);
  if (!name) {
    return { title: 'Раздел не найден — Полдень' };
  }
  const title = `${name} — Полдень`;
  const description = `Свежие новости раздела «${name}»: РИА, ТАСС, Lenta.ru, Коммерсантъ, BBC Russian`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function CategoryPage({ params }) {
  const name = slugToCategoryName(params.category);
  if (!name) notFound();
  return <NewsFeed category={name} />;
}
