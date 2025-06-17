"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ForumList from '@/components/ForumList';
import ForumPost from '@/components/ForumPost';
import PollList from '@/components/PollList';
import CreatePoll from '@/components/CreatePoll';

export default function CommunityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForum, setSelectedForum] = useState<number | null>(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handlePollCreated = () => {
    setShowCreatePoll(false);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Forums Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Discussion Forums</h2>
          {selectedForum ? (
            <div>
              <button
                onClick={() => setSelectedForum(null)}
                className="mb-4 text-blue-600 hover:text-blue-700"
              >
                ← Back to Forums
              </button>
              <ForumPost forumId={selectedForum} />
            </div>
          ) : (
            <ForumList onSelectForum={setSelectedForum} />
          )}
        </div>

        {/* Polls Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Fan Polls</h2>
            <button
              onClick={() => setShowCreatePoll(!showCreatePoll)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {showCreatePoll ? 'Cancel' : 'Create Poll'}
            </button>
          </div>
          
          {showCreatePoll ? (
            <CreatePoll onPollCreated={handlePollCreated} />
          ) : (
            <PollList />
          )}
        </div>
      </div>
    </div>
  );
} 