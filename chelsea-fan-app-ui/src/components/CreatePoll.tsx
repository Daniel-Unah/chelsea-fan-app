"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createPoll } from '@/services/polls';

interface CreatePollProps {
  onPollCreated: () => void;
}

export default function CreatePoll({ onPollCreated }: CreatePollProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a poll');
      return;
    }

    // Validate form data
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!endDate) {
      setError('End date is required');
      return;
    }
    if (options.filter(option => option.trim() !== '').length < 2) {
      setError('At least 2 options are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createPoll({
        title: title.trim(),
        description: description.trim(),
        endDate: new Date(endDate).toISOString(),
        options: options.filter(option => option.trim() !== '')
      });

      // Reset form
      setTitle('');
      setDescription('');
      setEndDate('');
      setOptions(['', '']);
      onPollCreated();
    } catch (e) {
      console.error('Error creating poll:', e);
      setError(e instanceof Error ? e.message : 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Create New Poll</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded min-h-[100px] bg-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Options</label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-blue-400 hover:text-blue-300"
            >
              + Add Option
            </button>
          </div>
        </div>

        {error && <div className="text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </div>
    </form>
  );
} 