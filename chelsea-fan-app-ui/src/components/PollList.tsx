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
      await loadPolls(); // Reload polls to get updated vote counts
    } catch (err) {
      setError('Failed to submit vote');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading polls...</div>;
  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">{error}</div>
      <button 
        onClick={loadPolls}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
  if (polls.length === 0) return (
    <div className="text-center py-8">
      <div className="text-gray-500 mb-4">No active polls available</div>
      <button 
        onClick={loadPolls}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <div key={poll.id} className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-white">{poll.title}</h3>
          <p className="text-gray-300 mb-4">{poll.description}</p>
          <div className="space-y-2">
            {poll.options?.map((option) => {
              const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
              const percentage = totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0;
              const hasVoted = poll.user_vote === option.id;

              return (
                <div key={option.id} className="relative">
                  <button
                    onClick={() => handleVote(poll.id, option.id)}
                    disabled={hasVoted}
                    className={`w-full p-3 text-left rounded-md transition-colors ${
                      hasVoted
                        ? 'bg-blue-600 border-2 border-blue-400'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{option.option_text}</span>
                      <span className="text-sm text-gray-300">
                        {option.votes || 0} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div
                      className="absolute inset-0 bg-blue-400 opacity-30 rounded-md"
                      style={{ width: `${percentage}%` }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-300">
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
                return <span>Ends: {endDate.toLocaleDateString()}</span>;
              }
            })()}
          </div>
        </div>
      ))}
    </div>
  );
} 