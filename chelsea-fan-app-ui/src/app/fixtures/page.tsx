"use client";
import { useEffect, useState } from 'react';
import { fetchFixtures, Fixture } from '@/services/fetchFixtures';
import FixtureCard from '@/components/FixtureCard';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFixtures()
      .then((data) => setFixtures(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const settled = new Set(['FINISHED', 'AWARDED', 'FT', 'CANCELLED', 'CANC', 'POSTPONED', 'PST']);
  const live = new Set(['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT', '1H', '2H', 'HT', 'PEN', 'AET']);
  const nextFixture = fixtures.find((fixture) => {
    if (settled.has(fixture.status || '')) return false;
    if (live.has(fixture.status || '')) return true;
    return new Date(fixture.date).getTime() >= Date.now();
  });

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Chelsea Fixtures</h1>
      
      {loading && <p>Loading fixtures...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {!loading && fixtures.length === 0 && !error && (
        <p>No fixtures found.</p>
      )}

      <div className="space-y-3 sm:space-y-4">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            isNextFixture={fixture.id === nextFixture?.id}
          />
        ))}
      </div>
    </div>
  );
} 