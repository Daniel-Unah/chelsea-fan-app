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

  if (loading) return <div className="text-gray-500">Loading forums...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <div
          key={forum.id}
          onClick={() => onSelectForum(forum.id)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold mb-2">{forum.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">{forum.description}</p>
        </div>
      ))}
    </div>
  );
} 