import NewsFeed from './components/NewsFeed';
import { ARTICLES } from '../lib/articles';

export default function Home() {
  return <NewsFeed category="Главное" articles={ARTICLES} />;
}
