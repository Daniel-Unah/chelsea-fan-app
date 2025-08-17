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
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded-lg mb-2 min-h-[100px]"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Post Comment
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500">Loading comments...</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{comment.user?.email}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}
          {!loading && comments.length === 0 && (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
} 