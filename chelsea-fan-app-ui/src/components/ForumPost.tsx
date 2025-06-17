"use client";
import { useState, useEffect } from 'react';
import { ForumPost as ForumPostType, ForumComment, fetchForumPosts, fetchForumComments, createForumPost, createForumComment } from '@/services/forums';
import { useAuth } from '@/context/AuthContext';

interface ForumPostProps {
  forumId: number;
}

export default function ForumPost({ forumId }: ForumPostProps) {
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, ForumComment[]>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, [forumId]);

  useEffect(() => {
    if (expandedPost) {
      loadComments(expandedPost);
    }
  }, [expandedPost]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchForumPosts(forumId);
      setPosts(data);
    } catch (e) {
      console.error('Error loading posts:', e);
      setError(e instanceof Error ? e.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: number) => {
    try {
      const data = await fetchForumComments(postId);
      setComments(prev => ({ ...prev, [postId]: data }));
    } catch (e) {
      console.error('Error loading comments:', e);
      setError(e instanceof Error ? e.message : 'Failed to load comments');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      setError(null);
      const post = await createForumPost(forumId, newPostTitle, newPostContent);
      setPosts([post, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
    } catch (e) {
      console.error('Error creating post:', e);
      setError(e instanceof Error ? e.message : 'Failed to create post');
    }
  };

  const handleCreateComment = async (postId: number) => {
    const commentContent = newComments[postId];
    if (!commentContent?.trim()) return;

    try {
      setError(null);
      const comment = await createForumComment(postId, commentContent);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComments(prev => ({ ...prev, [postId]: '' }));
    } catch (e) {
      console.error('Error creating comment:', e);
      setError(e instanceof Error ? e.message : 'Failed to create comment');
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

  if (loading) return <div className="text-gray-500">Loading posts...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Create new post form */}
      {user && (
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Post title"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Post content"
              className="w-full p-2 border rounded min-h-[100px]"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create Post
            </button>
          </div>
        </form>
      )}

      {/* Posts list with comments */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Post content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{post.content}</p>
              <div className="text-sm text-gray-500">
                <span>Posted by {post.user?.email}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            {/* Comments section */}
            <div className="border-t dark:border-gray-700">
              <div className="p-4">
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="text-blue-600 hover:text-blue-700 mb-4"
                >
                  {expandedPost === post.id ? 'Hide Comments' : 'Show Comments'} 
                  {comments[post.id]?.length ? ` (${comments[post.id].length})` : ''}
                </button>

                {expandedPost === post.id && (
                  <div className="space-y-4">
                    {/* Create comment form */}
                    {user && (
                      <div className="mb-4">
                        <textarea
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Add a comment..."
                          className="w-full p-2 border rounded min-h-[100px] mb-2"
                        />
                        <button
                          onClick={() => handleCreateComment(post.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          Post Comment
                        </button>
                      </div>
                    )}

                    {/* Comments list */}
                    <div className="space-y-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                          <div className="text-sm text-gray-500">
                            <span>Posted by {comment.user?.email}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 