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
    console.log('fetchComments called with:', { target, targetId });
    
    // Fetch the comments
    console.log('Querying database with:', { target, targetId });
    
    // Fetch the comments with proper filtering
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('target', target)
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });

    console.log('Raw comments from database:', comments);
    console.log('Comments error:', commentsError);

    if (commentsError) {
      console.error('Supabase error in fetchComments:', commentsError);
      throw new Error(commentsError.message);
    }

    // Get the current user's email
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserEmail = user?.email;
    console.log('Current user email:', currentUserEmail);

    // Map the comments with user data
    const commentsWithUsers = (comments || []).map(comment => ({
      ...comment,
      user: {
        email: comment.user_id === user?.id ? currentUserEmail : 'Anonymous User'
      }
    }));

    console.log('Comments with user data:', commentsWithUsers);
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
    console.log('addComment called with:', { content, target, targetId });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to add comments');
    }

    console.log('User authenticated:', user.id);

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

    console.log('Comment inserted successfully:', data);

    const result = {
      ...data,
      user: {
        email: user.email
      }
    } as Comment;

    console.log('Returning comment with user data:', result);
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