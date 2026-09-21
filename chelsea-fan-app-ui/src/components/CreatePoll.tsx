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

  const fieldClass = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-blue-600 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Create new poll</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${fieldClass} min-h-[100px]`}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">End date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className={`${fieldClass} flex-1`}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400"
            >
              + Add option
            </button>
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create poll'}
        </button>
      </div>
    </form>
  );
}
