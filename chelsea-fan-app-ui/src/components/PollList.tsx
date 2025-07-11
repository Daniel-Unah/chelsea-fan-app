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

  if (loading) return <div>Loading polls...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (polls.length === 0) return <div>No polls available</div>;

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <div key={poll.id} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{poll.title}</h3>
          <p className="text-gray-600 mb-4">{poll.description}</p>
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
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.option_text}</span>
                      <span className="text-sm text-gray-500">
                        {option.votes || 0} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div
                      className="absolute inset-0 bg-blue-200 opacity-20 rounded-md"
                      style={{ width: `${percentage}%` }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Ends: {new Date(poll.end_date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
} 