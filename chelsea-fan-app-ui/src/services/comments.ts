import { supabase } from '@/lib/supabaseClient';

export interface Comment {
  id: number;
  user_id: string;
  content: string;
  target: 'news' | 'fixture';
  target_id: number;
  created_at: string;
  user?: {
    email: string;
  };
}

export async function fetchComments(target: string, targetId: number) {
  try {
    // Fetch the comments with proper filtering
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('target', target)
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Supabase error in fetchComments:', commentsError);
      throw new Error(commentsError.message);
    }

    // Get the current user's email
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserEmail = user?.email;

    // Map the comments with user data
    const commentsWithUsers = (comments || []).map(comment => ({
      ...comment,
      user: {
        email: comment.user_id === user?.id ? currentUserEmail : 'Anonymous User'
      }
    }));

    return commentsWithUsers as Comment[];
  } catch (error) {
    console.error('Error in fetchComments:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
    throw new Error('Failed to fetch comments');
  }
}

export async function addComment(content: string, target: string, targetId: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to add comments');
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content,
          target,
          target_id: targetId,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in addComment:', error);
      throw new Error(error.message);
    }

    const result = {
      ...data,
      user: {
        email: user.email
      }
    } as Comment;
    return result;
  } catch (error) {
    console.error('Error in addComment:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
    throw new Error('Failed to add comment');
  }
}

export async function deleteComment(commentId: number) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Supabase error in deleteComment:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteComment:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
    throw new Error('Failed to delete comment');
  }
} 