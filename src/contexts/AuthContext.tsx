import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getProfile } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type AuthContextValue = {
  user: User | null;
  username: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const getInitial = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          try {
            const profile = await getProfile(u.id);
            if (!cancelled) setUsername(profile?.username ?? null);
          } catch {
            if (!cancelled) setUsername(null);
          }
        } else {
          setUsername(null);
        }
      } catch {
        if (!cancelled) setUser(null);
        if (!cancelled) setUsername(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    getInitial();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        try {
          const profile = await getProfile(u.id);
          setUsername(profile?.username ?? null);
        } catch {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ensure UI still updates; session may be cleared locally
      setUser(null);
      setUsername(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, username, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuth: AuthContextValue = {
  user: null,
  username: null,
  loading: true,
  signOut: async () => {},
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx ?? defaultAuth;
};
