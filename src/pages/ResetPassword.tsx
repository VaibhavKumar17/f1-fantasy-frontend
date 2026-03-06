import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setReady(true);
    };
    run();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don’t match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. Sign in with your new password.");
    navigate("/login", { replace: true });
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-carbon pt-24">
        <div className="mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card/90 p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-carbon pt-24">
        <div className="mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card/90 p-8 text-card-foreground shadow-lg">
          <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            F1 DELHI NCR COMMUNITY FANTASY
          </p>
          <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.25em] text-gradient-red">
            RESET PASSWORD
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            This link is invalid or has expired. Request a new one from the login page.
          </p>
          <Button asChild className="w-full font-racing tracking-[0.2em]">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon pt-24">
      <div className="mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card/90 p-8 text-card-foreground shadow-lg">
        <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          F1 DELHI NCR COMMUNITY FANTASY
        </p>
        <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.25em] text-gradient-red">
          SET NEW PASSWORD
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your new password below.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.18em]">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-0"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="confirm" className="text-xs font-medium uppercase tracking-[0.18em]">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-0"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <Button type="submit" className="mt-4 w-full font-racing tracking-[0.2em]" disabled={loading}>
            {loading ? "Updating…" : "UPDATE PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
