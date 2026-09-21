import { getSupabase } from '@/lib/supabaseClient';
import { blankToNull, normalizeUsername } from '@/lib/username';

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  favorite_current_player: string | null;
  favorite_historical_player: string | null;
  supporter_since: number | null;
  first_match: string | null;
  favorite_kit: string | null;
  chelsea_story: string | null;
};

export type ProfileUpdates = {
  username: string;
  favorite_current_player: string;
  favorite_historical_player: string;
  supporter_since: number | null;
  first_match: string;
  favorite_kit: string;
  chelsea_story: string;
};

export const PROFILE_SELECT =
  'id, username, avatar_url, favorite_current_player, favorite_historical_player, supporter_since, first_match, favorite_kit, chelsea_story';

const AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export function hasChelseaCard(profile: Pick<
  Profile,
  | 'favorite_current_player'
  | 'favorite_historical_player'
  | 'supporter_since'
  | 'first_match'
  | 'favorite_kit'
  | 'chelsea_story'
>) {
  return Boolean(
    profile.favorite_current_player ||
      profile.favorite_historical_player ||
      profile.supporter_since ||
      profile.first_match ||
      profile.favorite_kit ||
      profile.chelsea_story
  );
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('username', normalizeUsername(username))
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function isUsernameTaken(username: string, exceptUserId?: string) {
  let query = getSupabase()
    .from('profiles')
    .select('id')
    .eq('username', normalizeUsername(username));

  if (exceptUserId) {
    query = query.neq('id', exceptUserId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function updateMyProfile(input: ProfileUpdates) {
  const { data: auth } = await getSupabase().auth.getUser();
  if (!auth.user) throw new Error('You need to be logged in.');

  const { data, error } = await getSupabase()
    .from('profiles')
    .update({
      username: normalizeUsername(input.username),
      display_name: normalizeUsername(input.username),
      favorite_current_player: blankToNull(input.favorite_current_player),
      favorite_historical_player: blankToNull(input.favorite_historical_player),
      supporter_since: input.supporter_since,
      first_match: blankToNull(input.first_match),
      favorite_kit: blankToNull(input.favorite_kit),
      chelsea_story: blankToNull(input.chelsea_story),
    })
    .eq('id', auth.user.id)
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('That username is already taken.');
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function uploadMyAvatar(file: File): Promise<Profile> {
  if (!AVATAR_TYPES.has(file.type)) {
    throw new Error('Use a JPG, PNG, or WebP image.');
  }
  if (file.size > AVATAR_MAX_BYTES) {
    throw new Error('Keep the photo under 2 MB.');
  }

  const { data: auth } = await getSupabase().auth.getUser();
  if (!auth.user) throw new Error('You need to be logged in.');

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${auth.user.id}/avatar.${ext}`;

  const { error: uploadError } = await getSupabase().storage.from('avatars').upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: '3600',
  });
  if (uploadError) throw new Error(uploadError.message);

  const leftovers = ['jpg', 'png', 'webp'].filter((other) => other !== ext);
  await getSupabase().storage.from('avatars').remove(leftovers.map((other) => `${auth.user.id}/avatar.${other}`));

  const { data: publicUrl } = getSupabase().storage.from('avatars').getPublicUrl(path);
  const avatar_url = `${publicUrl.publicUrl}?v=${Date.now()}`;

  const { data, error } = await getSupabase()
    .from('profiles')
    .update({ avatar_url })
    .eq('id', auth.user.id)
    .select(PROFILE_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}
