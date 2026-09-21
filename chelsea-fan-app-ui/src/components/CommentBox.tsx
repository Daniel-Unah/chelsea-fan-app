"use client";
import { useState, useEffect, useCallback } from 'react';
import { Comment, fetchComments, addComment, deleteComment } from '@/services/comments';
import { useAuth } from '@/context/AuthContext';

interface CommentBoxProps {
  target: 'news' | 'fixture';
  targetId: number;
}

export default function CommentBox({ target, targetId }: CommentBoxProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComments(target, targetId);
      setComments(data);
    } catch (e) {
      console.error('Error loading comments:', e);
      setError(e instanceof Error ? e.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [target, targetId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setError(null);
      const comment = await addComment(newComment, target, targetId);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (e) {
      console.error('Error adding comment:', e);
      setError(e instanceof Error ? e.message : 'Failed to add comment');
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      setError(null);
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (e) {
      console.error('Error deleting comment:', e);
      setError(e instanceof Error ? e.message : 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Comments</h3>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="mb-5">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2 min-h-[88px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-blue-600 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Post comment
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading comments...</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  {comment.user?.email && (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.user.email}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}
          {!loading && comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet. Be the first to comment.</p>
          )}
        </div>
      )}
    </div>
  );
}
