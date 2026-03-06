import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, username")
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
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
  const trimmed = username.trim();
  if (!trimmed) return { error: "Username is required" };
  try {
    const { error } = await supabase.from("profiles").insert({ user_id: userId, username: trimmed });
    if (error) {
      if (error.code === "23505") return { error: "This username is already taken" };
      return { error: error.message };
    }
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save username" };
  }
}
