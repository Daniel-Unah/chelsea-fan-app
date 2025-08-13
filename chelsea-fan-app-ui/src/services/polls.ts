import { supabase } from '@/lib/supabaseClient';

export interface Poll {
  id: number;
  title: string;
  description: string;
  end_date: string;
  created_at: string;
  options?: PollOption[];
  user_vote?: number;
}

export interface PollOption {
  id: number;
  poll_id: number;
  option_text: string;
  created_at: string;
  votes?: number;
}

interface CreatePollData {
  title: string;
  description: string;
  endDate: string;
  options: string[];
}

export async function deleteExpiredPolls(): Promise<void> {
  try {
    const currentDate = new Date().toISOString();
    
    // First, get the IDs of expired polls
    const { data: expiredPollIds, error: fetchError } = await supabase
      .from('polls')
      .select('id')
      .lt('end_date', currentDate);

    if (fetchError) {
      console.error('Error fetching expired poll IDs:', fetchError);
      throw fetchError;
    }

    if (!expiredPollIds || expiredPollIds.length === 0) {
      console.log('No expired polls to delete');
      return;
    }

    const pollIds = expiredPollIds.map(poll => poll.id);
    
    // Delete poll votes for expired polls first (due to foreign key constraints)
    const { error: votesError } = await supabase
      .from('poll_votes')
      .delete()
      .in('poll_id', pollIds);

    if (votesError) {
      console.error('Error deleting poll votes:', votesError);
      throw votesError;
    }

    // Delete poll options for expired polls
    const { error: optionsError } = await supabase
      .from('poll_options')
      .delete()
      .in('poll_id', pollIds);

    if (optionsError) {
      console.error('Error deleting poll options:', optionsError);
      throw optionsError;
    }

    // Delete expired polls
    const { error: pollsError } = await supabase
      .from('polls')
      .delete()
      .in('id', pollIds);

    if (pollsError) {
      console.error('Error deleting expired polls:', pollsError);
      throw pollsError;
    }

    console.log(`Deleted ${pollIds.length} expired polls successfully`);
  } catch (error) {
    console.error('Error deleting expired polls:', error);
    throw error;
  }
}

export async function fetchPolls(): Promise<Poll[]> {
  try {
    // First, delete any expired polls
    await deleteExpiredPolls();

    const { data: polls, error } = await supabase
      .from('polls')
      .select('*')
      .gte('end_date', new Date().toISOString()) // Only fetch non-expired polls
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get current user's votes
    const { data: userVotes } = await supabase
      .from('poll_votes')
      .select('poll_id, option_id');

    // Get options and vote counts for each poll
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const { data: options } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', poll.id);

        const { data: votes } = await supabase
          .from('poll_votes')
          .select('option_id')
          .eq('poll_id', poll.id);

        const voteCounts = votes?.reduce((acc, vote) => {
          acc[vote.option_id] = (acc[vote.option_id] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const optionsWithVotes = options?.map((option) => ({
          ...option,
          votes: voteCounts?.[option.id] || 0,
        }));

        return {
          ...poll,
          options: optionsWithVotes,
          user_vote: userVotes?.find((vote) => vote.poll_id === poll.id)?.option_id,
        };
      })
    );

    return pollsWithOptions;
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
}

export async function fetchPollOptions(pollId: number): Promise<PollOption[]> {
  try {
    const { data: options, error } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', pollId);

    if (error) throw error;

    // Get vote counts for each option
    const { data: votes } = await supabase
      .from('poll_votes')
      .select('option_id')
      .eq('poll_id', pollId);

    const voteCounts = votes?.reduce((acc, vote) => {
      acc[vote.option_id] = (acc[vote.option_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return options.map((option) => ({
      ...option,
      votes: voteCounts?.[option.id] || 0,
    }));
  } catch (error) {
    console.error('Error fetching poll options:', error);
    throw error;
  }
}

export async function voteInPoll(pollId: number, optionId: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: existingVote, error: fetchError } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from('poll_votes')
        .update({ option_id: optionId })
        .eq('poll_id', pollId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    } else {
      // Create new vote
      const { error: insertError } = await supabase
        .from('poll_votes')
        .insert({ 
          poll_id: pollId, 
          option_id: optionId,
          user_id: user.id 
        });

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error voting in poll:', error);
    throw error;
  }
}

export async function createPoll(data: CreatePollData): Promise<void> {
  try {
    console.log('Creating poll with data:', data);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create a poll');
    }

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title,
        description: data.description,
        end_date: data.endDate,
        user_id: user.id,
      })
      .select()
      .single();

    if (pollError) {
      console.error('Poll creation error:', pollError);
      throw new Error(`Failed to create poll: ${pollError.message}`);
    }

    console.log('Poll created successfully:', poll);

    // Create poll options
    const optionsData = data.options.map((option) => ({
      poll_id: poll.id,
      option_text: option,
    }));
    
    console.log('Creating poll options:', optionsData);
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData);

    if (optionsError) {
      console.error('Poll options creation error:', optionsError);
      throw new Error(`Failed to create poll options: ${optionsError.message}`);
    }

    console.log('Poll options created successfully');
  } catch (error) {
    console.error('Error creating poll:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    }
    throw new Error('Failed to create poll: Unknown error');
  }
} 