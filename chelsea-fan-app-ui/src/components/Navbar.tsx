"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-blue-700 text-white px-4 sm:px-6 py-4 shadow">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-bold text-lg sm:text-xl hover:underline">Chelsea Fan App</Link>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/news" className="hover:underline">News</Link>
          <Link href="/fixtures" className="hover:underline">Fixtures</Link>
          <Link href="/roster" className="hover:underline">Roster</Link>
          <Link href="/community" className="hover:underline">Community</Link>
        </div>

        {/* Desktop auth button */}
        <div className="hidden md:block">
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
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-600">
          <div className="flex flex-col space-y-3 pt-4">
            <Link href="/news" className="hover:underline">News</Link>
            <Link href="/fixtures" className="hover:underline">Fixtures</Link>
            <Link href="/roster" className="hover:underline">Roster</Link>
            <Link href="/community" className="hover:underline">Community</Link>
            {user ? (
              <button
                onClick={logout}
                className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold text-left"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold text-center"
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