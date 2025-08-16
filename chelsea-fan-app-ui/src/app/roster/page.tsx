"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchRoster, Player } from '@/services/fetchRoster';
import PlayerCard from '@/components/PlayerCard';
import { useAuth } from '@/context/AuthContext';

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRoster()
      .then((data) => setPlayers(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chelsea Squad</h1>
      
      {loading && <p>Loading squad...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {!loading && players.length === 0 && !error && (
        <p>No players found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
} 