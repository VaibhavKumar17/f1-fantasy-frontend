import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearSupabaseAuthStorage } from "./lib/supabase";

// Clear all saved Supabase auth/sessions from this browser (no stored emails or logins)
clearSupabaseAuthStorage();

createRoot(document.getElementById("root")!).render(<App />);
