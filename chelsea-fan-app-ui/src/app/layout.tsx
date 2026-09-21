import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chelsea Fan App",
  description: "Your one-stop destination for all things Chelsea FC - news, fixtures, roster, and community discussions",
  icons: {
    icon: [
      { url: '/chelsea-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/chelsea-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/chelsea-logo.png',
    apple: '/chelsea-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/chelsea-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-gray-900 dark:text-gray-100`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="mt-16 border-t border-blue-800/40 bg-blue-900 text-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
              <p className="text-sm text-blue-100">
                &copy; {new Date().getFullYear()} Chelsea Fan App
              </p>
              <p className="text-xs text-blue-200/80">
                Independent fan project. Not affiliated with Chelsea FC.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
