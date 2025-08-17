import { supabase } from '@/lib/supabaseClient';

export interface Forum {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export async function fetchForums(): Promise<Forum[]> {
  try {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forums:', error);
      throw error;
    }

    return data as Forum[];
  } catch (error) {
    console.error('Error in fetchForums:', error);
    throw error;
  }
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  category: string;
}

export interface ForumComment {
  id: number;
  post_id: number;
  content: string;
  user_id: string;
  created_at: string;
}

export async function fetchForumPosts(category?: string): Promise<ForumPost[]> {
  try {
    let query = supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching forum posts:', error);
      throw new Error(`Failed to fetch forum posts: ${error.message}`);
    }

    return data as ForumPost[];
  } catch (error) {
    console.error('Error in fetchForumPosts:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch forum posts: ${error.message}`);
    }
    throw new Error('Failed to fetch forum posts: Unknown error');
  }
}

export async function fetchForumPost(postId: number): Promise<ForumPost> {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        user:user_id (email),
        comment_count:forum_comments (count)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching forum post:', error);
      throw error;
    }

    return data as ForumPost;
  } catch (error) {
    console.error('Error in fetchForumPost:', error);
    throw error;
  }
}

export async function createForumPost(title: string, content: string, category: string): Promise<ForumPost> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a post');
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .insert([
        {
          title,
          content,
          category,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }

    return {
      ...data,
      user: {
        email: user.email
      }
    } as ForumPost;
  } catch (error) {
    console.error('Error in createForumPost:', error);
    throw error;
  }
}

export async function fetchForumComments(postId: number): Promise<ForumComment[]> {
  try {
    const { data, error } = await supabase
      .from('forum_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forum comments:', error);
      throw error;
    }

    return data as ForumComment[];
  } catch (error) {
    console.error('Error in fetchForumComments:', error);
    throw error;
  }
}

export async function createForumComment(postId: number, content: string): Promise<ForumComment> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a comment');
    }

    const { data, error } = await supabase
      .from('forum_comments')
      .insert([
        {
          post_id: postId,
          content,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating forum comment:', error);
      throw error;
    }

    return {
      ...data,
      user: {
        email: user.email
      }
    } as ForumComment;
  } catch (error) {
    console.error('Error in createForumComment:', error);
    throw error;
  }
}

export async function deleteForumPost(postId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting forum post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteForumPost:', error);
    throw error;
  }
}

export async function deleteForumComment(commentId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('forum_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting forum comment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteForumComment:', error);
    throw error;
  }
} 