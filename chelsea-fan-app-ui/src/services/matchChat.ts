import { getSupabase } from '@/lib/supabaseClient';
import type { Profile } from '@/services/profiles';

export type MatchSort = 'recent' | 'top';

export interface MatchComment {
  id: number;
  fixture_id: number;
  user_id: string;
  parent_id: number | null;
  content: string;
  score: number;
  created_at: string;
  username: string;
  avatar_url: string | null;
  liked_by_me: boolean;
  replies: MatchComment[];
}

type CommentRow = {
  id: number;
  fixture_id: number;
  user_id: string;
  parent_id: number | null;
  content: string;
  score: number;
  created_at: string;
  profile?: Pick<Profile, 'username' | 'avatar_url'> | Pick<Profile, 'username' | 'avatar_url'>[] | null;
  votes?: { user_id: string }[] | null;
};

function profileFrom(row: CommentRow) {
  const profile = Array.isArray(row.profile) ? row.profile[0] : row.profile;
  return {
    username: profile?.username || 'blue',
    avatar_url: profile?.avatar_url || null,
  };
}

function toComment(row: CommentRow, userId?: string): MatchComment {
  return {
    id: row.id,
    fixture_id: row.fixture_id,
    user_id: row.user_id,
    parent_id: row.parent_id,
    content: row.content,
    score: row.score,
    created_at: row.created_at,
    ...profileFrom(row),
    liked_by_me: Boolean(userId && row.votes?.some((vote) => vote.user_id === userId)),
    replies: [],
  };
}

function threadRootId(comment: MatchComment, byId: Map<number, MatchComment>): number {
  let current = comment;
  const seen = new Set<number>();
  while (current.parent_id && byId.has(current.parent_id) && !seen.has(current.id)) {
    seen.add(current.id);
    current = byId.get(current.parent_id)!;
  }
  return current.id;
}

export function nestComments(rows: MatchComment[], sort: MatchSort): MatchComment[] {
  const byId = new Map(rows.map((row) => [row.id, { ...row, replies: [] as MatchComment[] }]));
  const roots: MatchComment[] = [];

  for (const comment of byId.values()) {
    if (!comment.parent_id || !byId.has(comment.parent_id)) {
      roots.push(comment);
      continue;
    }
    const root = byId.get(threadRootId(comment, byId))!;
    if (root.id === comment.id) {
      roots.push(comment);
    } else {
      root.replies.push(comment);
    }
  }

  const byRecent = (a: MatchComment, b: MatchComment) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  const byTop = (a: MatchComment, b: MatchComment) => b.score - a.score || byRecent(a, b);

  for (const root of roots) {
    root.replies.sort(byRecent);
  }

  return roots.sort(sort === 'top' ? byTop : byRecent);
}

async function currentUserId() {
  const { data } = await getSupabase().auth.getUser();
  return data.user?.id;
}

async function currentIdentity() {
  const { data } = await getSupabase().auth.getUser();
  const user = data.user;
  if (!user) throw new Error('You need to be logged in to join the match thread.');

  const { data: profile, error } = await getSupabase()
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) throw new Error('Finish setting up your profile before posting.');

  return { user, profile: profile as Profile };
}

export async function fetchMatchComments(fixtureId: number, sort: MatchSort): Promise<MatchComment[]> {
  const userId = await currentUserId();
  const { data, error } = await getSupabase()
    .from('match_comments')
    .select('id, fixture_id, user_id, parent_id, content, score, created_at, profile:profiles(username, avatar_url), votes:match_comment_votes(user_id)')
    .eq('fixture_id', fixtureId);

  if (error) throw new Error(error.message);
  return nestComments((data || []).map((row) => toComment(row as CommentRow, userId)), sort);
}

export async function postMatchComment(
  fixtureId: number,
  content: string,
  parentId?: number | null
): Promise<MatchComment> {
  const { user, profile } = await currentIdentity();

  const { data, error } = await getSupabase()
    .from('match_comments')
    .insert({
      fixture_id: fixtureId,
      user_id: user.id,
      parent_id: parentId || null,
      content: content.trim(),
    })
    .select('id, fixture_id, user_id, parent_id, content, score, created_at')
    .single();

  if (error) throw new Error(error.message);

  return {
    ...(data as Omit<MatchComment, 'username' | 'avatar_url' | 'liked_by_me' | 'replies'>),
    username: profile.username,
    avatar_url: profile.avatar_url,
    liked_by_me: false,
    replies: [],
  };
}

export async function toggleMatchCommentLike(commentId: number, liked: boolean) {
  const { user } = await currentIdentity();

  if (liked) {
    const { error } = await getSupabase()
      .from('match_comment_votes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await getSupabase()
    .from('match_comment_votes')
    .insert({ comment_id: commentId, user_id: user.id });
  if (error) throw new Error(error.message);
}

export function subscribeMatchComments(
  fixtureId: number,
  onChange: () => void
) {
  return getSupabase()
    .channel(`match-chat-${fixtureId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'match_comments', filter: `fixture_id=eq.${fixtureId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'match_comment_votes' },
      onChange
    )
    .subscribe();
}
