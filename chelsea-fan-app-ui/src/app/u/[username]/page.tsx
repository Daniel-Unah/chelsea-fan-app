"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/Avatar";
import LoadingState from "@/components/LoadingState";
import { fetchProfileByUsername, hasChelseaCard, type Profile } from "@/services/profiles";
import { fetchRoster, type Player } from "@/services/fetchRoster";
import { publicProfilePath } from "@/lib/chelseaProfile";

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = String(params.username || "");
  const { user, profile: myProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchProfileByUsername(username), fetchRoster()])
      .then(([nextProfile, roster]) => {
        if (cancelled) return;
        setProfile(nextProfile);
        setPlayers(roster);
        setError(nextProfile ? null : "This fan has not set up a profile yet.");
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load this profile.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const currentFavorite = useMemo(
    () => players.find((player) => player.name === profile?.favorite_current_player),
    [players, profile?.favorite_current_player]
  );

  const isOwner = Boolean(user && profile && user.id === profile.id);
  const cardReady = profile ? hasChelseaCard(profile) : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      {loading && <LoadingState label="Loading profile..." />}
      {error && !profile && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</p>
      )}

      {profile && (
        <>
          <section className="overflow-hidden rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-900/20">
            <div className="flex flex-col items-start gap-5 px-6 py-7 sm:flex-row sm:items-center">
              <Avatar name={profile.username} url={profile.avatar_url} size={88} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Chelsea supporter</p>
                <h1 className="mt-2 truncate text-3xl font-bold tracking-tight">@{profile.username}</h1>
              </div>
              {isOwner && (
                <Link
                  href="/profile"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Edit profile
                </Link>
              )}
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chelsea card</h2>
              {isOwner && (
                <Link href="/profile" className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {cardReady ? "Update" : "Add yours"}
                </Link>
              )}
            </div>

            {!cardReady && (
              <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700">
                {isOwner
                  ? "Add your favorite players and a few Chelsea facts so other Blues know who you are."
                  : "This fan has not filled in their Chelsea card yet."}
              </p>
            )}

            {cardReady && (
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.favorite_current_player && (
                  <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">
                      Favorite now
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      {currentFavorite?.photo_url ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-blue-50">
                          <Image
                            src={currentFavorite.photo_url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {profile.favorite_current_player}
                        </p>
                        {currentFavorite?.position && (
                          <p className="text-sm text-gray-500">{currentFavorite.position}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <Fact label="All-time favorite" value={profile.favorite_historical_player} />
                <Fact label="Supporter since" value={profile.supporter_since} />
                <Fact label="First match" value={profile.first_match} />
                <Fact label="Favorite kit" value={profile.favorite_kit} />
              </div>
            )}

            {profile.chelsea_story && (
              <blockquote className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-5 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">
                  Why Chelsea
                </p>
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed">{profile.chelsea_story}</p>
              </blockquote>
            )}
          </section>

          {myProfile && !isOwner && (
            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href={publicProfilePath(myProfile.username)} className="font-semibold text-blue-700 dark:text-blue-400">
                View your profile
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
