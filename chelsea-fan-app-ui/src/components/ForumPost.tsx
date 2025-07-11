"use client";
import { useState, useEffect } from 'react';
import { ForumPost as ForumPostType, ForumComment, fetchForumPosts, fetchForumComments, createForumPost, createForumComment } from '@/services/forums';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // We need to get the forum name first, then use it as category
      const { data: forums } = await supabase
        .from('forums')
        .select('name')
        .eq('id', forumId)
        .single();
      
      if (forums) {
        const data = await fetchForumPosts(forums.name);
        setPosts(data);
      }
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
      // Get the forum name to use as category
      const { data: forums } = await supabase
        .from('forums')
        .select('name')
        .eq('id', forumId)
        .single();
      
      if (forums) {
        const post = await createForumPost(newPostTitle, newPostContent, forums.name);
        setPosts([post, ...posts]);
        setNewPostTitle('');
        setNewPostContent('');
      }
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

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-100 p-4 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Create new post form */}
      {user && (
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Post</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Post content"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[100px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Create Post
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts list with comments */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Post content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">User</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            {/* Comments section */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <svg
                    className={`w-5 h-5 mr-2 transform transition-transform ${
                      expandedPost === post.id ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {expandedPost === post.id ? 'Hide Comments' : 'Show Comments'}
                  {comments[post.id]?.length ? (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {comments[post.id].length}
                    </span>
                  ) : null}
                </button>

                {expandedPost === post.id && (
                  <div className="mt-4 space-y-4">
                    {/* Create comment form */}
                    {user && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <textarea
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Add a comment..."
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[100px]"
                        />
                        <button
                          onClick={() => handleCreateComment(post.id)}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    )}

                    {/* Comments list */}
                    <div className="space-y-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-700 dark:text-gray-300">User</span>
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