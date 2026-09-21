"use client";

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MatchComment,
  MatchSort,
  fetchMatchComments,
  postMatchComment,
  subscribeMatchComments,
  toggleMatchCommentLike,
} from '@/services/matchChat';

function timeLabel(value: string) {
  return new Date(value).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Composer({
  placeholder,
  onSubmit,
  disabled,
}: {
  placeholder: string;
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || sending) return;
    setSending(true);
    try {
      await onSubmit(value);
      setValue('');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        disabled={disabled || sending}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-600 focus:ring-2 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        disabled={disabled || sending || !value.trim()}
        className="self-end rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Post'}
      </button>
    </form>
  );
}

function CommentCard({
  comment,
  depth,
  onReply,
  onLike,
  canInteract,
}: {
  comment: MatchComment;
  depth: number;
  onReply: (parentId: number, content: string) => Promise<void>;
  onLike: (comment: MatchComment) => Promise<void>;
  canInteract: boolean;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <article className={depth > 0 ? 'border-l-2 border-blue-200 pl-4 dark:border-blue-900' : ''}>
      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.display_name}</p>
          <p className="text-xs text-gray-500">{timeLabel(comment.created_at)}</p>
        </div>
        <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
        <div className="mt-3 flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onLike(comment)}
            disabled={!canInteract}
            className={comment.liked_by_me ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 hover:text-blue-700'}
          >
            {comment.liked_by_me ? 'Liked' : 'Like'} · {comment.score}
          </button>
          <button
            type="button"
            onClick={() => setReplying((open) => !open)}
            disabled={!canInteract}
            className="text-gray-500 hover:text-blue-700"
          >
            Reply
          </button>
        </div>
        {replying && (
          <div className="mt-3">
            <Composer
              placeholder={`Reply to ${comment.display_name}...`}
              onSubmit={async (content) => {
                await onReply(comment.id, content);
                setReplying(false);
              }}
            />
          </div>
        )}
      </div>
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onLike={onLike}
              canInteract={canInteract}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default function MatchChat({ fixtureId }: { fixtureId: number }) {
  const { user } = useAuth();
  const [sort, setSort] = useState<MatchSort>('recent');
  const [comments, setComments] = useState<MatchComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchMatchComments(fixtureId, sort);
      setComments(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the match thread.');
    } finally {
      setLoading(false);
    }
  }, [fixtureId, sort]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    const channel = subscribeMatchComments(fixtureId, () => {
      load();
    });
    return () => {
      channel.unsubscribe();
    };
  }, [fixtureId, load]);

  const loginHref = useMemo(() => `/login?next=/fixtures/${fixtureId}`, [fixtureId]);

  const handlePost = async (content: string, parentId?: number) => {
    await postMatchComment(fixtureId, content, parentId);
    await load();
  };

  const handleLike = async (comment: MatchComment) => {
    if (!user) return;
    await toggleMatchCommentLike(comment.id, comment.liked_by_me);
    await load();
  };

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Match thread</h2>
        <div className="flex rounded-full bg-gray-100 p-1 dark:bg-gray-800">
          {(['recent', 'top'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSort(option)}
              className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                sort === option
                  ? 'bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {user ? (
        <div className="mb-6">
          <Composer placeholder="Start a thread..." onSubmit={(content) => handlePost(content)} />
        </div>
      ) : (
        <p className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
          <Link href={loginHref} className="font-semibold underline">
            Log in
          </Link>{' '}
          to post, reply, or like a comment.
        </p>
      )}

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-500">Loading the thread...</p>}
      {!loading && comments.length === 0 && (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700">
          No comments yet. Be the first voice in the room.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            depth={0}
            onReply={(parentId, content) => handlePost(content, parentId)}
            onLike={handleLike}
            canInteract={Boolean(user)}
          />
        ))}
      </div>
    </section>
  );
}
