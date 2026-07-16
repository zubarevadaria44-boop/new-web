import { notFound } from 'next/navigation';
import { CATEGORY_LIST, slugToCategoryName, getArticlesByCategory } from '../../../lib/articles';
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
  const description = `Материалы раздела «${name}» самарского журнала «Полдень»`;
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
  return <NewsFeed category={name} articles={getArticlesByCategory(name)} />;
}
