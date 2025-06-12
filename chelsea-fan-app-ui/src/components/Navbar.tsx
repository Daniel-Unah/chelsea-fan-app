"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl hover:underline">Chelsea Fan App</Link>
        <Link href="/news" className="hover:underline">News</Link>
        <Link href="/fixtures" className="hover:underline">Fixtures</Link>
        <Link href="/roster" className="hover:underline">Roster</Link>
        <Link href="/community" className="hover:underline">Community</Link>
      </div>
      <div>
        {user ? (
          <button
            onClick={logout}
            className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
} 