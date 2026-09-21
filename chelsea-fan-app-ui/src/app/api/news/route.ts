import { NextResponse } from 'next/server';

export const revalidate = 300;

const CHELSEA_NEWS_QUERY =
  '("Chelsea FC" OR "Chelsea Football Club" OR "Stamford Bridge") AND (football OR "Premier League")';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'News API key not configured' }, { status: 500 });
  }

  const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(CHELSEA_NEWS_QUERY)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${apiKey}`;

  try {
    const res = await fetch(newsUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 