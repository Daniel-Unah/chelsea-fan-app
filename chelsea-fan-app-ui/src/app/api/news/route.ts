import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '("Chelsea FC" OR "Chelsea Football Club" OR "Stamford Bridge" OR "Enzo Maresca" OR "Cole Palmer" OR "Enzo Fernandez") AND (football OR Premier League)';
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'News API key not configured' }, { status: 500 });
  }

  const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${apiKey}`;

  try {
    const res = await fetch(newsUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 