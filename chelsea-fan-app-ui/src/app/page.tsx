"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchFixtures, findNextFixture, Fixture } from '@/services/fetchFixtures';

const destinations = [
  {
    href: '/news',
    title: 'Latest News',
    description: 'Club headlines, match reaction, and transfer talk from trusted sources.',
    label: 'Read news',
  },
  {
    href: '/fixtures',
    title: 'Fixtures',
    description: 'Upcoming matches, live scores, and results across every competition.',
    label: 'See fixtures',
  },
  {
    href: '/roster',
    title: 'Squad',
    description: 'The current Chelsea roster, grouped by position with player details.',
    label: 'View squad',
  },
  {
    href: '/community',
    title: 'Community',
    description: 'Talk tactics, vote in polls, and share the conversation with other Blues.',
    label: 'Join in',
  },
];

export default function Home() {
  const [nextFixture, setNextFixture] = useState<Fixture | null>(null);

  useEffect(() => {
    fetchFixtures()
      .then((data) => setNextFixture(findNextFixture(data) || null))
      .catch(() => setNextFixture(null));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="relative overflow-hidden rounded-3xl bg-blue-700 px-6 py-12 text-white shadow-xl shadow-blue-900/20 sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-blue-900/50 blur-3xl" />
        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/chelsea-logo.png"
                alt="Chelsea FC crest"
                width={56}
                height={56}
                className="h-14 w-14 object-contain drop-shadow-lg"
                priority
              />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
                Keep the blue flag flying
              </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to Chelsea Fan App
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={nextFixture ? `/fixtures/${nextFixture.id}` : '/fixtures'}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Next match
              </Link>
              <Link
                href="/news"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Latest headlines
              </Link>
            </div>
          </div>

          {nextFixture && (
            <Link
              href={`/fixtures/${nextFixture.id}`}
              className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Next up</p>
              <p className="mt-3 text-2xl font-bold">{nextFixture.opponent}</p>
              <p className="mt-1 text-sm text-blue-100">
                {nextFixture.home_or_away === 'home' ? 'Home' : 'Away'} · {nextFixture.competition}
              </p>
              <p className="mt-4 text-sm font-medium">
                {new Date(nextFixture.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
                {' · '}
                {new Date(nextFixture.date).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'UTC',
                })}{' '}
                UTC
              </p>
            </Link>
          )}
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {destinations.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700 dark:text-blue-400">
              {item.label}
              <svg className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
