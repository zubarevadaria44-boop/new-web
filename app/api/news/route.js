import { NextResponse } from 'next/server';
import { fetchAllNews } from '../../../lib/news';

export const revalidate = 300; // кэш на 5 минут на стороне Vercel

export async function GET() {
  const data = await fetchAllNews();
  return NextResponse.json(data);
}
