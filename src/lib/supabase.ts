import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** Site URL for auth redirects (e.g. https://f1-fantasyclub.netlify.app). Set in Supabase Dashboard → Auth → URL Configuration too. */
export const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

let _supabase: SupabaseClient;
try {
  _supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ0NjQ4MDAsImV4cCI6MTk2MDAyMDgwMH0.placeholder",
    {
      auth: {
        lock: false,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    }
  );
} catch {
  _supabase = createClient(
    "https://placeholder.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
    {
      auth: {
        lock: false,
      }
    }
  );
}
export const supabase = _supabase;

/** Remove Supabase auth/session from localStorage to clear old data (fixes lock/AbortError in some cases). Logs user out. */
export function clearSupabaseAuthStorage(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("sb-") && key.includes("auth"))) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export type Profile = { user_id: string; username: string };

const profilePromises = new Map<string, Promise<Profile | null>>();

export async function getProfile(userId: string): Promise<Profile | null> {
  let promise = profilePromises.get(userId);
  if (!promise) {
    promise = (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, username")
          .eq("user_id", userId)
          .single();
        if (error) {
          console.error("getProfile database error:", error);
          return null;
        }
        if (!data) return null;
        return data as Profile;
      } catch (err) {
        console.error("getProfile catch exception:", err);
        return null;
      }
    })();
    profilePromises.set(userId, promise);
  }
  return promise;
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const trimmed = username.trim().toLowerCase();
  if (!trimmed) return false;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("username", trimmed)
      .limit(1)
      .maybeSingle();
    return !data;
  } catch {
    return false;
  }
}

export async function createProfile(userId: string, username: string): Promise<{ error: string | null }> {
  profilePromises.delete(userId);
  const trimmed = username.trim();
  if (!trimmed) return { error: "Username is required" };
  try {
    const { error } = await supabase.from("profiles").insert({ user_id: userId, username: trimmed });
    if (error) {
      console.error("createProfile database error:", error);
      if (error.code === "23505") return { error: "This username is already taken" };
      return { error: error.message };
    }
    return { error: null };
  } catch (e) {
    console.error("createProfile catch exception:", e);
    return { error: e instanceof Error ? e.message : "Failed to save username" };
  }
}
