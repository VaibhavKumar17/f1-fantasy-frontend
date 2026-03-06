import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearSupabaseAuthStorage } from "./lib/supabase";

try {
  clearSupabaseAuthStorage();
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");
  createRoot(root).render(<App />);
} catch (e) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = [
      "<div style='min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;padding:2rem;font-family:sans-serif;background:#0a0a0a;color:#fff;text-align:center'>",
      "<h1 style='font-size:1.25rem'>Something went wrong</h1>",
      "<p style='color:#888;font-size:0.875rem'>Check the console or try again. If you just deployed, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your host's environment variables.</p>",
      "</div>",
    ].join("");
  }
  throw e;
}
