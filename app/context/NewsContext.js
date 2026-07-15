'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const NewsContext = createContext(null);

export function NewsProvider({ initialData, children }) {
  const [items, setItems] = useState(initialData.items || []);
  const [failedSources, setFailedSources] = useState(initialData.failedSources || []);
  const [trending, setTrending] = useState(initialData.trending || []);
  const [currency, setCurrency] = useState(initialData.currency || { usd: null, eur: null });
  const [updatedAt, setUpdatedAt] = useState(initialData.updatedAt || null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      const data = await res.json();
      setItems(data.items || []);
      setFailedSources(data.failedSources || []);
      setTrending(data.trending || []);
      setCurrency(data.currency || { usd: null, eur: null });
      setUpdatedAt(data.updatedAt);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <NewsContext.Provider value={{ items, failedSources, trending, currency, updatedAt, loading, refresh }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return useContext(NewsContext);
}
