"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchNews } from '@/services/fetchNews';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
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
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chelsea News</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {!loading && news.length === 0 && !error && <p>No news articles found.</p>}
      <div className="flex flex-col gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 rounded shadow p-4 flex gap-4">
            {item.image_url && (
              <div className="flex-shrink-0">
                <Image src={item.image_url} alt={item.title} width={120} height={80} className="rounded object-cover" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
              </p>
              <p className="mb-2">{item.body.length > 120 ? item.body.slice(0, 120) + '...' : item.body}</p>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Read more</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 