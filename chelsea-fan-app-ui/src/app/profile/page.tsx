"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import { CHELSEA_LEGENDS, CURRENT_YEAR, parseYear, publicProfilePath } from "@/lib/chelseaProfile";
import { usernameError } from "@/lib/username";
import { isUsernameTaken, updateMyProfile, uploadMyAvatar } from "@/services/profiles";
import { fetchRoster, type Player } from "@/services/fetchRoster";

const fieldClass =
  "mb-4 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none ring-blue-600 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

export default function ProfilePage() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [favoriteCurrent, setFavoriteCurrent] = useState("");
  const [favoriteHistorical, setFavoriteHistorical] = useState("");
  const [supporterSince, setSupporterSince] = useState("");
  const [firstMatch, setFirstMatch] = useState("");
  const [favoriteKit, setFavoriteKit] = useState("");
  const [chelseaStory, setChelseaStory] = useState("");
  const [squad, setSquad] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setFavoriteCurrent(profile.favorite_current_player || "");
      setFavoriteHistorical(profile.favorite_historical_player || "");
      setSupporterSince(profile.supporter_since ? String(profile.supporter_since) : "");
      setFirstMatch(profile.first_match || "");
      setFavoriteKit(profile.favorite_kit || "");
      setChelseaStory(profile.chelsea_story || "");
    }
  }, [profile]);

  useEffect(() => {
    fetchRoster()
      .then((players) => setSquad(players.slice().sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setSquad([]));
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
        <PageHeader eyebrow="Your locker" title="Edit profile" />
        <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
          <Link href="/login?next=/profile" className="font-semibold underline">
            Log in
          </Link>{" "}
          to set your username, photo, and Chelsea card.
        </p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const handleProblem = usernameError(username);
    const year = parseYear(supporterSince);
    if (handleProblem) {
      setError(handleProblem);
      return;
    }
    if (year === undefined) {
      setError(`Supporter since needs to be a year between 1905 and ${CURRENT_YEAR}.`);
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      if (await isUsernameTaken(username, user.id)) {
        setError("That username is already taken.");
        return;
      }
      await updateMyProfile({
        username,
        favorite_current_player: favoriteCurrent,
        favorite_historical_player: favoriteHistorical,
        supporter_since: year,
        first_match: firstMatch,
        favorite_kit: favoriteKit,
        chelsea_story: chelseaStory,
      });
      await refreshProfile();
      setNotice("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setNotice(null);
    try {
      await uploadMyAvatar(file);
      await refreshProfile();
      setNotice("Photo updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload that photo.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader eyebrow="Your locker" title="Edit profile" />

      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={profile?.username || "Blue"} url={profile?.avatar_url} size={80} />
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              @{profile?.username || "username"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-60 dark:text-blue-400"
              >
                {uploading ? "Uploading..." : "Change photo"}
              </button>
              {profile?.username && (
                <Link
                  href={publicProfilePath(profile.username)}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400"
                >
                  View public profile
                </Link>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handlePhoto(e.target.files?.[0])}
            />
          </div>
        </div>

        <form onSubmit={handleSave}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <div className="mb-4 flex items-center rounded-xl border border-gray-300 bg-white ring-blue-600 focus-within:ring-2 dark:border-gray-700 dark:bg-gray-800">
            <span className="pl-3 text-sm text-gray-400">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              minLength={3}
              maxLength={20}
              className="w-full bg-transparent px-2 py-2.5 text-gray-900 outline-none dark:text-white"
              required
            />
          </div>

          <h2 className="mb-3 mt-2 text-lg font-semibold text-gray-900 dark:text-white">Chelsea card</h2>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Favorite current player</label>
          <input
            list="current-squad"
            value={favoriteCurrent}
            onChange={(e) => setFavoriteCurrent(e.target.value)}
            maxLength={60}
            placeholder="Cole Palmer"
            className={fieldClass}
          />
          <datalist id="current-squad">
            {squad.map((player) => (
              <option key={player.id} value={player.name} />
            ))}
          </datalist>

          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Favorite historical player</label>
          <input
            list="chelsea-legends"
            value={favoriteHistorical}
            onChange={(e) => setFavoriteHistorical(e.target.value)}
            maxLength={60}
            placeholder="Didier Drogba"
            className={fieldClass}
          />
          <datalist id="chelsea-legends">
            {CHELSEA_LEGENDS.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>

          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Supporter since</label>
          <input
            type="number"
            inputMode="numeric"
            min={1905}
            max={CURRENT_YEAR}
            value={supporterSince}
            onChange={(e) => setSupporterSince(e.target.value)}
            placeholder="2012"
            className={fieldClass}
          />

          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First match</label>
          <input
            type="text"
            value={firstMatch}
            onChange={(e) => setFirstMatch(e.target.value)}
            maxLength={80}
            placeholder="Chelsea 2-1 Liverpool, Stamford Bridge"
            className={fieldClass}
          />

          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Favorite kit</label>
          <input
            type="text"
            value={favoriteKit}
            onChange={(e) => setFavoriteKit(e.target.value)}
            maxLength={80}
            placeholder="2005/06 home, or the 2012 away"
            className={fieldClass}
          />

          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Why Chelsea</label>
          <textarea
            value={chelseaStory}
            onChange={(e) => setChelseaStory(e.target.value)}
            maxLength={280}
            rows={4}
            placeholder="The moment, the player, or the season that made you a Blue."
            className={`${fieldClass} resize-none`}
          />

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {notice && <p className="mb-4 text-sm text-green-600 dark:text-green-400">{notice}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Log out
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
