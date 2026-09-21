"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { publicProfilePath } from "@/lib/chelseaProfile";

const links = [
  { href: "/news", label: "News" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/roster", label: "Roster" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const username = profile?.username || "Profile";
  const profileHref = profile?.username ? publicProfilePath(profile.username) : "/profile";
  const onProfile = pathname === "/profile" || pathname === profileHref;

  return (
    <nav className="sticky top-0 z-40 border-b border-blue-800/50 bg-blue-700/95 text-white shadow-lg shadow-blue-900/20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <Image
            src="/chelsea-logo.png"
            alt="Chelsea FC crest"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="text-base sm:text-lg">Chelsea Fan App</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-white text-blue-700"
                  : "text-blue-50 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={profileHref}
                className={`flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm font-semibold transition ${
                  onProfile ? "bg-white text-blue-700" : "text-white hover:bg-white/10"
                }`}
              >
                <Avatar name={username} url={profile?.avatar_url} size={28} />
                <span className="max-w-[9rem] truncate">@{username}</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-blue-600 px-4 pb-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 pt-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(link.href) ? "bg-white text-blue-700" : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={profileHref}
                  onClick={() => setIsMenuOpen(false)}
                  className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    onProfile ? "bg-white text-blue-700" : "hover:bg-white/10"
                  }`}
                >
                  <Avatar name={username} url={profile?.avatar_url} size={28} />
                  @{username}
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="rounded-lg bg-white px-3 py-2 text-left text-sm font-semibold text-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
