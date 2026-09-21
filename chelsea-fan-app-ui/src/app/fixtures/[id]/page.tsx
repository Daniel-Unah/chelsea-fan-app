"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MatchChat from '@/components/MatchChat';
import LoadingState from '@/components/LoadingState';
import { Fixture, fetchFixtureById, isFinishedFixture, isLiveFixture } from '@/services/fetchFixtures';

export default function MatchCenterPage() {
  const params = useParams();
  const fixtureId = Number(params.id);
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(fixtureId)) {
      setError('Match not found.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = () => {
      fetchFixtureById(fixtureId)
        .then((data) => {
          if (cancelled) return;
          if (!data) {
            setError('Match not found.');
            return;
          }
          setFixture(data);
          setError(null);
        })
        .catch((e) => {
          if (!cancelled) setError(e.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    load();
    const interval = window.setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [fixtureId]);

  const live = isLiveFixture(fixture?.status);
  const finished = isFinishedFixture(fixture?.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/fixtures" className="mb-5 inline-block text-sm font-semibold text-blue-700 dark:text-blue-400">
        ← All fixtures
      </Link>

      {loading && <LoadingState label="Loading match..." />}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      {fixture && (
        <>
          <section className="mb-6 overflow-hidden rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-900/20">
            <div className="flex items-center justify-between px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              <span>{fixture.competition}</span>
              <span>{live ? 'Live' : finished ? 'Full time' : 'Match thread'}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 pb-6">
              <div className="flex flex-col items-end gap-2">
                <div className="relative h-12 w-12">
                  <Image src="/chelsea-logo.png" alt="Chelsea" fill className="object-contain" />
                </div>
                <p className="text-sm font-semibold">Chelsea</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold tabular-nums">
                  {fixture.score || 'vs'}
                </p>
                <p className="mt-2 text-xs text-blue-100">
                  {new Date(fixture.date).toLocaleString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC',
                  })}{' '}
                  UTC
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                {fixture.opponent_logo ? (
                  <div className="relative h-12 w-12">
                    <Image src={fixture.opponent_logo} alt={fixture.opponent} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                    {fixture.opponent.split(' ').map((word) => word[0]).join('')}
                  </div>
                )}
                <p className="text-sm font-semibold">{fixture.opponent}</p>
              </div>
            </div>
            <p className="border-t border-white/10 px-5 py-3 text-center text-sm text-blue-100">
              {fixture.home_or_away === 'home' ? 'Stamford Bridge' : 'Away'}
              {live ? ' · Score refreshes every 30 seconds' : ''}
            </p>
          </section>

          <MatchChat fixtureId={fixture.id} />
        </>
      )}
    </div>
  );
}
