import { NextResponse } from 'next/server';

// Бесплатный переводчик без ключа. У него есть дневной лимит символов —
// если он исчерпан, просто возвращаем оригинальный текст без перевода,
// чтобы сайт не ломался.
async function translateOne(text, target) {
  if (!text || !text.trim()) return text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|${target}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    return translated && !translated.toLowerCase().includes('quota') ? translated : text;
  } catch (e) {
    return text;
  }
}

export async function POST(request) {
  const body = await request.json();
  const texts = Array.isArray(body.texts) ? body.texts : [];
  const target = body.target === 'en' ? 'en' : 'ru';

  if (target === 'ru') {
    return NextResponse.json({ translations: texts });
  }

  // Небольшая конкурентность, чтобы не словить бан по частоте запросов
  const CONCURRENCY = 5;
  const results = new Array(texts.length);
  let cursor = 0;

  async function worker() {
    while (cursor < texts.length) {
      const idx = cursor++;
      results[idx] = await translateOne(texts[idx], target);
    }
  }

  await Promise.all(new Array(CONCURRENCY).fill(0).map(worker));
  return NextResponse.json({ translations: results });
}
