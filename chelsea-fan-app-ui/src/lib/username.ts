export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'mod',
  'moderator',
  'support',
  'official',
  'chelsea',
  'chelseafc',
  'cfc',
  'blues',
  'stamford',
  'bridge',
  'login',
  'signup',
  'profile',
  'settings',
  'news',
  'fixtures',
  'roster',
  'community',
  'match',
  'help',
  'api',
  'www',
  'root',
  'system',
]);

export function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function usernameError(value: string) {
  const username = normalizeUsername(value);
  if (!USERNAME_PATTERN.test(username)) {
    return 'Usernames are 3-20 characters: letters, numbers, and underscores.';
  }
  if (RESERVED_USERNAMES.has(username)) {
    return 'That username is reserved.';
  }
  return null;
}
