import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearSupabaseAuthStorage, isSupabaseConfigured } from "./lib/supabase";

const fallbackHtml = [
  "<div style='min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;padding:2rem;font-family:sans-serif;background:#fff;color:#111;text-align:center'>",
  "<h1 style='font-size:1.25rem;margin:0'>Configuration required</h1>",
  "<p style='color:#333;font-size:0.875rem;margin:0'>Set these in Vercel/Netlify → Environment Variables:</p>",
  "<p style='color:#555;font-size:0.8rem;margin:0'>VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL</p>",
  "<p style='color:#777;font-size:0.75rem;margin:0.5rem 0 0'>Root Directory = frontend. Redeploy after setting.</p>",
  "</div>",
].join("");

if (!isSupabaseConfigured()) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = fallbackHtml;
  }
} else {
  // Clear auth storage only if user explicitly opted out of keeping logged in
  if (localStorage.getItem("keep_logged_in") === "false") {
    clearSupabaseAuthStorage();
  }

  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
}
