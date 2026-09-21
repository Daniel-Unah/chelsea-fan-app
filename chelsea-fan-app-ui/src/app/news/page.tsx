"use client";
import { useEffect, useState } from 'react';
import { fetchNews, NewsItem } from '@/services/fetchNews';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CommentBox from '@/components/CommentBox';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';

function ArticleCard({
  item,
  featured = false,
  user,
}: {
  item: NewsItem;
  featured?: boolean;
  user: ReturnType<typeof useAuth>['user'];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className={featured ? 'lg:grid lg:grid-cols-2' : 'flex flex-col sm:flex-row'}>
        {item.image_url && (
          <div className={`relative ${featured ? 'h-64 lg:h-full min-h-64' : 'h-48 sm:h-auto sm:w-56'} shrink-0`}>
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {item.source_name && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                {item.source_name}
              </span>
            )}
            {item.author && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                by {item.author}
              </span>
            )}
          </div>
          <h2 className={`font-semibold leading-tight text-gray-900 dark:text-white ${featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
            {item.title}
          </h2>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }) : ''}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
            {item.body.length > 220 ? item.body.slice(0, 220) + '...' : item.body}
          </p>
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400"
            >
              Read full article
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
        {user ? (
          <CommentBox key={`comment-${item.id}`} target="news" targetId={item.id} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="font-semibold text-blue-700 dark:text-blue-400">
              Login
            </Link>{' '}
            to comment on this article
          </p>
        )}
      </div>
    </article>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNews()
      .then((data) => setNews(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = news;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader eyebrow="The Bridge" title="Chelsea News" />
      {loading && <LoadingState label="Loading headlines..." />}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">Error: {error}</p>}
      {!loading && news.length === 0 && !error && (
        <p className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500 dark:border-gray-700">
          No news articles found.
        </p>
      )}
      <div className="flex flex-col gap-6">
        {featured && <ArticleCard item={featured} featured user={user} />}
        {rest.map((item) => (
          <ArticleCard key={item.id} item={item} user={user} />
        ))}
      </div>
    </div>
  );
}
