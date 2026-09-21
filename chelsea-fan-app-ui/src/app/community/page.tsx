"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ForumList from '@/components/ForumList';
import ForumPost from '@/components/ForumPost';
import PollList from '@/components/PollList';
import CreatePoll from '@/components/CreatePoll';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

export default function CommunityPage() {
  const [selectedForum, setSelectedForum] = useState<number | null>(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const { user } = useAuth();

  const handlePollCreated = () => {
    setShowCreatePoll(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader eyebrow="The Shed" title="Chelsea Community" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Discussion Forums</h2>
            {selectedForum && (
              <button
                onClick={() => setSelectedForum(null)}
                className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200"
              >
                ← Back to forums
              </button>
            )}
          </div>
          {selectedForum ? (
            <ForumPost forumId={selectedForum} />
          ) : (
            <ForumList onSelectForum={setSelectedForum} />
          )}
        </section>

        <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fan Polls</h2>
            {user ? (
              <button
                onClick={() => setShowCreatePoll(!showCreatePoll)}
                className="rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {showCreatePoll ? 'Cancel' : 'Create poll'}
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200"
              >
                Login to create a poll
              </Link>
            )}
          </div>

          {showCreatePoll && user ? (
            <CreatePoll onPollCreated={handlePollCreated} />
          ) : (
            <PollList />
          )}
        </section>
      </div>
    </div>
  );
}
