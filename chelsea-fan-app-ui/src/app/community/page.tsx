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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Chelsea Community
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Join the discussion with fellow Chelsea fans
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Forums Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Discussion Forums
                </h2>
                {selectedForum && (
                  <button
                    onClick={() => setSelectedForum(null)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    ← Back to Forums
                  </button>
                )}
              </div>
              {selectedForum ? (
                <ForumPost forumId={selectedForum} />
              ) : (
                <ForumList onSelectForum={setSelectedForum} />
              )}
            </div>
          </div>

          {/* Polls Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Fan Polls
                </h2>
                <button
                  onClick={() => setShowCreatePoll(!showCreatePoll)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
      </div>
    </div>
  );
} 