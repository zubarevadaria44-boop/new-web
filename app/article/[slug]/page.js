import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES, getArticleBySlug, getRelatedArticles } from '../../../lib/articles';
import ArticleBody from '../../components/ArticleBody';
import ShareButtons from '../../components/ShareButtons';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Материал не найден — Полдень' };
  return {
    title: `${article.title} — Полдень`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt },
    twitter: { title: article.title, description: article.excerpt },
  };
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  const related = getRelatedArticles(article);
  const url = `/article/${article.slug}`;

  return (
    <main className="article-page">
      <Link href="/" className="article-back">Все материалы</Link>

      <article className="article-page-card">
        {article.image ? (
          <div className="article-page-hero" style={{ backgroundImage: `url('${article.image}')` }} />
        ) : (
          <div className="article-page-hero placeholder"><span>{article.title.charAt(0)}</span></div>
        )}

        <div className="article-page-body">
          <ArticleBody article={article} />
          {article.image2 && (
            <div className="article-inline-img" style={{ backgroundImage: `url('${article.image2}')` }} />
          )}
          <ShareButtons url={url} title={article.title} />
        </div>
      </article>

      {related.length > 0 && (
        <div className="article-related-section">
          <span className="read-also-label">Похожие материалы</span>
          <div className="grid">
            {related.map((r) => (
              <div className="card" key={r.slug}>
                {r.image ? (
                  <div className="card-img" style={{ backgroundImage: `url('${r.image}')` }} />
                ) : (
                  <div className="card-img placeholder"><span>{r.title.charAt(0)}</span></div>
                )}
                <div className="tag">{r.category}</div>
                <h3><Link href={`/article/${r.slug}`}>{r.title}</Link></h3>
                <p>{r.excerpt}…</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
