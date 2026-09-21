"use client";
import { useEffect, useMemo, useState } from 'react';
import { fetchRoster, Player } from '@/services/fetchRoster';
import PlayerCard from '@/components/PlayerCard';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';

const GROUPS = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', 'Squad'] as const;

function groupFor(position: string) {
  const p = position.toLowerCase();
  if (p.includes('goal')) return 'Goalkeepers';
  if (p.includes('def') || p.includes('back')) return 'Defenders';
  if (p.includes('mid')) return 'Midfielders';
  if (p.includes('off') || p.includes('forw') || p.includes('wing') || p.includes('attack')) return 'Forwards';
  return 'Squad';
}

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoster()
      .then((data) => setPlayers(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Player[]>();
    for (const player of players) {
      const group = groupFor(player.position);
      map.set(group, [...(map.get(group) || []), player]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.number || 99) - (b.number || 99) || a.name.localeCompare(b.name));
    }
    return map;
  }, [players]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader eyebrow="The squad" title="Chelsea Squad" />

      {loading && <LoadingState label="Loading squad..." />}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">Error: {error}</p>}

      {!loading && players.length === 0 && !error && (
        <p className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500 dark:border-gray-700">
          No players found.
        </p>
      )}

      <div className="space-y-10">
        {GROUPS.map((group) => {
          const list = grouped.get(group);
          if (!list?.length) return null;
          return (
            <section key={group}>
              <div className="mb-4 flex items-end justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{group}</h2>
                <span className="text-sm text-gray-500">{list.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {list.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
