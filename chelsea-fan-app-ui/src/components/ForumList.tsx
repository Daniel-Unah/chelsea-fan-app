"use client";
import { useState, useEffect } from 'react';
import { Forum, fetchForums } from '@/services/forums';

interface ForumListProps {
  onSelectForum: (forumId: number) => void;
}

export default function ForumList({ onSelectForum }: ForumListProps) {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForums();
  }, []);

  const loadForums = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchForums();
      setForums(data);
    } catch (e) {
      console.error('Error loading forums:', e);
      setError(e instanceof Error ? e.message : 'Failed to load forums');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-100 p-4 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <div
          key={forum.id}
          onClick={() => onSelectForum(forum.id)}
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {forum.name}
              </h3>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {forum.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 