export const CHELSEA_LEGENDS = [
  'Peter Osgood',
  'Ron Harris',
  'Bobby Tambling',
  'Kerry Dixon',
  'Gianfranco Zola',
  'Dennis Wise',
  'Ruud Gullit',
  'Gianluca Vialli',
  'Frank Lampard',
  'John Terry',
  'Didier Drogba',
  'Petr Cech',
  'Michael Essien',
  'Claude Makelele',
  'Ashley Cole',
  'Eden Hazard',
  "N'Golo Kante",
  'Cesar Azpilicueta',
  'Diego Costa',
  'Jimmy Floyd Hasselbaink',
];

export const CURRENT_YEAR = new Date().getUTCFullYear();

export function publicProfilePath(username: string) {
  return `/u/${encodeURIComponent(username)}`;
}

export function parseYear(value: string) {
  if (!value.trim()) return null;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1905 || year > CURRENT_YEAR) {
    return undefined;
  }
  return year;
}
