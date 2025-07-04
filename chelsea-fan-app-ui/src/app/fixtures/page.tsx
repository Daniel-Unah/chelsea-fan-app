"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFixtures, Fixture } from '@/services/fetchFixtures';
import FixtureCard from '@/components/FixtureCard';
import { useAuth } from '@/context/AuthContext';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchFixtures()
      .then((data) => setFixtures(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, router]);

  // Find the next fixture (first fixture without a score)
  const nextFixture = fixtures.find(fixture => !fixture.score);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chelsea Fixtures</h1>
      
      {loading && <p>Loading fixtures...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {!loading && fixtures.length === 0 && !error && (
        <p>No fixtures found.</p>
      )}

      <div className="space-y-4">
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