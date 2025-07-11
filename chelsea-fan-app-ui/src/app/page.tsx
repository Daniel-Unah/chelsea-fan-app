"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl mb-4">
            Welcome to Chelsea Fan App
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
            Your one-stop destination for all things Chelsea FC
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <Link href="/news" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Latest News</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Stay updated with the latest Chelsea FC news and updates</p>
          </Link>
          <Link href="/fixtures" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Fixtures</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">View upcoming matches and latest results</p>
          </Link>
          <Link href="/community" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Community</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Join discussions and polls with fellow Chelsea fans</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
