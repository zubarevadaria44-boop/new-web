import { notFound } from 'next/navigation';
import { CATEGORY_LIST, slugToCategoryName } from '../../../lib/news';
import NewsFeed from '../../components/NewsFeed';

export function generateStaticParams() {
  return CATEGORY_LIST.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const name = slugToCategoryName(params.category);
  return {
    title: name ? `${name} — Полдень` : 'Раздел не найден — Полдень',
  };
}

export default function CategoryPage({ params }) {
  const name = slugToCategoryName(params.category);
  if (!name) notFound();
  return <NewsFeed category={name} />;
}
