'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';
import { fetchProfile, type Profile } from '@/services/profiles';
import { normalizeUsername } from '@/lib/username';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  refreshProfile: () => Promise<Profile | null>;
  login: (email: string, password: string) => Promise<{ error: AuthError | null } | undefined>;
  signup: (
    email: string,
    password: string,
    identity: { username: string }
  ) => Promise<{ error: AuthError | null; needsConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async (userId?: string | null) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    const next = await fetchProfile(userId);
    setProfile(next);
    return next;
  };

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      const nextUser = data.session?.user ?? null;
      setUser(nextUser);
      loadProfile(nextUser?.id).catch(() => setProfile(null));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      loadProfile(nextUser?.id).catch(() => setProfile(null));
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    return { error };
  };

  const signup = async (
    email: string,
    password: string,
    identity: { username: string }
  ) => {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: {
          username: normalizeUsername(identity.username),
        },
      },
    });
    // With email confirmation enabled Supabase returns no session until the
    // user clicks through, so the caller has to prompt instead of redirecting.
    return { error, needsConfirmation: !error && !data.session };
  };

  const logout = async () => {
    await getSupabase().auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => loadProfile(user?.id);

  return (
    <AuthContext.Provider value={{ user, profile, refreshProfile, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
