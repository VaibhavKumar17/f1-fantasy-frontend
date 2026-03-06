import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase, checkUsernameAvailable, createProfile } from "@/lib/supabase";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    const un = username.trim();
    if (!un) {
      toast.error("Please choose a username. One username per person.");
      return;
    }
    if (un.length < 2 || un.length > 24) {
      toast.error("Username must be 2–24 characters.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    const available = await checkUsernameAvailable(un);
    if (!available) {
      toast.error("This username is already taken. Choose another.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) {
      setLoading(false);
      const msg = error.message || "";
      if (msg.toLowerCase().includes("rate limit") || (error as any).status === 429) {
        toast.warning(
          "We’ve sent too many emails in a short time. Please check your inbox (and spam) or try again in a few minutes."
        );
      } else {
        toast.error(msg || "Sign up failed. Please try again.");
      }
      return;
    }
    if (data?.user) {
      if (data.user.identities?.length === 0) {
        setLoading(false);
        toast.error("An account with this email already exists. Sign in instead.");
        return;
      }

      // If email confirmation is required, Supabase returns a user but no active session.
      // In that case, skip creating the profile now (RLS blocks it) and let the user set
      // their username after the first real sign-in from the Profile page.
      if (!data.session) {
        setLoading(false);
        toast.success(
          "Account created. Check your email to confirm, then set your username after you sign in."
        );
        navigate("/login", { replace: true });
        return;
      }

      const { error: profileError } = await createProfile(data.user.id, un);
      if (profileError) {
        setLoading(false);
        toast.error(profileError);
        return;
      }
      setLoading(false);
      toast.success("Account created. You can sign in now.");
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon pt-24">
      <div className="mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card/90 p-8 text-card-foreground shadow-lg">
        <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          F1 DELHI NCR COMMUNITY FANTASY
        </p>
        <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.25em] text-gradient-red">
          SIGN UP
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Create an account to save your team, track your rank, and join the leaderboard.
        </p>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="space-y-1 text-sm">
            <label htmlFor="username" className="text-xs font-medium uppercase tracking-[0.18em]">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-0"
              placeholder="e.g. speedster_fan"
              minLength={2}
              maxLength={24}
            />
            <p className="text-[0.65rem] text-muted-foreground">One username per person. Shown on leaderboard.</p>
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.18em]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-0"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.18em]">
              Password
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-0"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button type="submit" className="mt-4 w-full font-racing tracking-[0.2em]" disabled={loading}>
            {loading ? "Creating account…" : "CREATE ACCOUNT"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium uppercase tracking-[0.18em] text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
