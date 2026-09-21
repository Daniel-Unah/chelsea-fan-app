'use client';
import { useEffect, useState } from 'react';
import { Poll, fetchPolls, voteInPoll } from '@/services/polls';
import { useAuth } from '@/context/AuthContext';

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const data = await fetchPolls();
      setPolls(data);
    } catch (err) {
      setError('Failed to load polls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: number, optionId: number) => {
    if (!user) {
      setError('Please log in to vote');
      return;
    }

    try {
      await voteInPoll(pollId, optionId);
      await loadPolls();
    } catch (err) {
      setError('Failed to submit vote');
      console.error(err);
    }
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Loading polls...</div>;
  if (error) return (
    <div className="py-8 text-center">
      <div className="mb-4 text-red-500">{error}</div>
      <button
        onClick={loadPolls}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
  if (polls.length === 0) return (
    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center dark:border-gray-700">
      <div className="mb-4 text-gray-500">No active polls available</div>
      <button
        onClick={loadPolls}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {polls.map((poll) => (
        <div key={poll.id} className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/60">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{poll.title}</h3>
          <p className="mb-4 mt-1 text-sm text-gray-600 dark:text-gray-300">{poll.description}</p>
          <div className="space-y-2">
            {poll.options?.map((option) => {
              const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
              const percentage = totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0;
              const hasVoted = poll.user_vote === option.id;

              return (
                <div key={option.id} className="relative">
                  <button
                    onClick={() => handleVote(poll.id, option.id)}
                    disabled={!user}
                    className={`relative w-full overflow-hidden rounded-xl border p-3 text-left transition ${
                      hasVoted
                        ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40'
                        : 'border-gray-200 bg-white hover:border-blue-200 dark:border-gray-700 dark:bg-gray-900'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-100 dark:bg-blue-900/40"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="font-medium text-gray-900 dark:text-white">{option.option_text}</span>
                      <span className="shrink-0 text-sm text-gray-500">
                        {option.votes || 0} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {(() => {
              const endDate = new Date(poll.end_date);
              const now = new Date();
              const timeLeft = endDate.getTime() - now.getTime();
              const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

              if (daysLeft <= 0) {
                return <span className="text-red-500">Poll ended</span>;
              } else if (daysLeft === 1) {
                return <span className="text-orange-500">Ends tomorrow</span>;
              } else if (daysLeft <= 3) {
                return <span className="text-orange-500">Ends in {daysLeft} days</span>;
              } else {
                return <span>Ends {endDate.toLocaleDateString()}</span>;
              }
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
