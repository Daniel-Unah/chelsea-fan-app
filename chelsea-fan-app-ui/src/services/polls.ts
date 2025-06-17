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

export async function fetchPolls(): Promise<Poll[]> {
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select('*')
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
    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title,
        description: data.description,
        end_date: data.endDate,
      })
      .select()
      .single();

    if (pollError) throw pollError;

    // Create poll options
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(
        data.options.map((option) => ({
          poll_id: poll.id,
          option_text: option,
        }))
      );

    if (optionsError) throw optionsError;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
} 