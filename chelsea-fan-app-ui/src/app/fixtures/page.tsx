"use client";
import { useEffect, useState } from 'react';
import { fetchFixtures, findNextFixture, Fixture } from '@/services/fetchFixtures';
import FixtureCard from '@/components/FixtureCard';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';

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

  const nextFixture = findNextFixture(fixtures);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader eyebrow="Matchday" title="Chelsea Fixtures" />

      {loading && <LoadingState label="Loading fixtures..." />}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">Error: {error}</p>}

      {!loading && fixtures.length === 0 && !error && (
        <p className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500 dark:border-gray-700">
          No fixtures found.
        </p>
      )}

      <div className="space-y-3">
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
