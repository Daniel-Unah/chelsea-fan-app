"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ForumList from '@/components/ForumList';
import ForumPost from '@/components/ForumPost';
import PollList from '@/components/PollList';
import CreatePoll from '@/components/CreatePoll';

export default function CommunityPage() {
  const [selectedForum, setSelectedForum] = useState<number | null>(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const { user } = useAuth();

  const handlePollCreated = () => {
    setShowCreatePoll(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white lg:text-5xl xl:text-6xl">
            Chelsea Community
          </h1>
          <p className="mt-4 sm:mt-5 max-w-xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400 px-4">
            Join the discussion with fellow Chelsea fans
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Forums Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Discussion Forums
                </h2>
                {selectedForum && (
                  <button
                    onClick={() => setSelectedForum(null)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Fan Polls
                </h2>
                {user ? (
                  <button
                    onClick={() => setShowCreatePoll(!showCreatePoll)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {showCreatePoll ? 'Cancel' : 'Create Poll'}
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Login to Create Poll
                  </a>
                )}
              </div>
              
              {showCreatePoll && user ? (
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