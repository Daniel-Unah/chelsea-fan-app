"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { safeNext } from "@/lib/safeNext";
import { usernameError } from "@/lib/username";
import { isUsernameTaken } from "@/services/profiles";
import Link from "next/link";
import Image from "next/image";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { user, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const handleProblem = usernameError(username);
    if (handleProblem) {
      setError(handleProblem);
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      if (await isUsernameTaken(username)) {
        setError("That username is already taken.");
        setLoading(false);
        return;
      }

      const { error, needsConfirmation } = await signup(email, password, {
        username,
      });
      setLoading(false);
      if (error) {
        setError(error.message || "Signup failed");
      } else if (needsConfirmation) {
        setNotice("Check your email to confirm your account, then log in.");
      } else {
        router.push(next === "/" ? "/profile" : next);
      }
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  useEffect(() => {
    if (user) {
      router.push(next === "/" ? "/profile" : next);
    }
  }, [user, router, next]);

  if (user) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/chelsea-logo.png" alt="" width={48} height={48} className="mb-3 h-12 w-12 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
        </div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <div className="mb-4 flex items-center rounded-xl border border-gray-300 bg-white ring-blue-600 focus-within:ring-2 dark:border-gray-700 dark:bg-gray-800">
          <span className="pl-3 text-sm text-gray-400">@</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase())}
            minLength={3}
            maxLength={20}
            placeholder="bluesfan"
            autoComplete="username"
            className="w-full bg-transparent px-2 py-2.5 text-gray-900 outline-none dark:text-white"
            required
          />
        </div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none ring-blue-600 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none ring-blue-600 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {notice && <p className="mb-4 text-sm text-green-600 dark:text-green-400">{notice}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
