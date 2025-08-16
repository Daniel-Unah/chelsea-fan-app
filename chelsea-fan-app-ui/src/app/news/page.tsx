"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchNews, NewsItem } from '@/services/fetchNews';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import CommentBox from '@/components/CommentBox';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchNews()
      .then((data) => setNews(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Chelsea News</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {!loading && news.length === 0 && !error && <p>No news articles found.</p>}
      <div className="flex flex-col gap-4 sm:gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {item.image_url && (
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Image 
                    src={item.image_url} 
                    alt={item.title} 
                    width={200} 
                    height={150} 
                    className="rounded-lg object-cover w-full sm:w-[200px] h-[150px]" 
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {item.source_name && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      {item.source_name}
                    </span>
                  )}
                  {item.author && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      by {item.author}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white leading-tight">{item.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : ''}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                  {item.body.length > 200 ? item.body.slice(0, 200) + '...' : item.body}
                </p>
                {item.source_url && (
                  <a 
                    href={item.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Read full article
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <CommentBox target="news" targetId={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 