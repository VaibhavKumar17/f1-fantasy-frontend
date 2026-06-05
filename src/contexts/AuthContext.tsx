import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getProfile, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type AuthContextValue = {
  user: User | null;
  username: string | null;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const timeoutPromise = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => {
      resolve(fallback);
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(fallback);
      });
  });
};

const getProjectRef = () => {
  const url = import.meta.env.VITE_SUPABASE_URL ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase/);
  return match ? match[1] : "";
};

const getCachedSession = () => {
  try {
    const ref = getProjectRef();
    if (!ref) return null;
    const key = `sb-${ref}-auth-token`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = getCachedSession();
    return cached?.user ?? null;
  });
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Initialized synchronously to false
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    const getInitial = async () => {
      try {
        const sessionResult = await timeoutPromise(
          supabase.auth.getSession(),
          15000,
          { data: { session: null }, error: null }
        );
        if (cancelled) return;
        const u = sessionResult.data?.session?.user ?? null;
        setUser(u);
        
        if (u) {
          setProfileLoading(true);
          try {
            const profile = await timeoutPromise(getProfile(u.id), 15000, null);
            if (!cancelled) setUsername(profile?.username ?? null);
          } catch {
            if (!cancelled) setUsername(null);
          } finally {
            if (!cancelled) setProfileLoading(false);
          }
        } else {
          setUsername(null);
          setProfileLoading(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setUsername(null);
          setProfileLoading(false);
        }
      }
    };
    getInitial();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setProfileLoading(true);
        try {
          const profile = await timeoutPromise(getProfile(u.id), 15000, null);
          setUsername(profile?.username ?? null);
        } catch {
          setUsername(null);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUsername(null);
        setProfileLoading(false);
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      localStorage.removeItem("keep_logged_in");
      await supabase.auth.signOut();
    } catch {
      setUser(null);
      setUsername(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, username, loading, profileLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuth: AuthContextValue = {
  user: null,
  username: null,
  loading: false,
  profileLoading: true,
  signOut: async () => {},
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx ?? defaultAuth;
};
