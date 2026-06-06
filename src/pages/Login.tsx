import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase, siteUrl } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        toast.error(error.message);
        return;
      }
      if (data?.user) {
        try {
          localStorage.setItem("keep_logged_in", keepLoggedIn ? "true" : "false");
        } catch (storageError) {
          console.warn("Storage not available:", storageError);
        }
        toast.success("Signed in.");
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Login exception:", err);
      toast.error(err?.message || "An unexpected network or configuration error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = forgotMode ? forgotEmail.trim() : email.trim();
    if (!emailToUse) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    const redirectTo = `${(siteUrl || window.location.origin).replace(/\/$/, "")}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, { redirectTo });
    setLoading(false);
    if (error) {
      const msg = error.message || "";
      const msgLower = msg.toLowerCase();
      if (msgLower.includes("rate limit") || error.status === 429) {
        toast.warning(
          "Too many password reset requests. Please wait a few minutes and try again."
        );
      } else if (
        msgLower.includes("smtp") ||
        msgLower.includes("failed to send") ||
        msgLower.includes("email provider") ||
        msgLower.includes("unexpected_failure") ||
        msgLower.includes("error sending")
      ) {
        toast.error(
          "We could not send the password reset email. Please try again later."
        );
      } else {
        toast.error(msg || "Could not send reset email. Please try again in a minute.");
      }
      return;
    }
    setForgotSent(true);
    toast.success("Check your email for the reset link.");
  };

  const loginBg = {
    backgroundImage: "url(/f1-login-bg.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (forgotMode) {
    return (
      <div className="login-bg-sharp relative flex min-h-screen items-center justify-center px-3 pt-20 pb-8 sm:pt-24" style={loginBg}>
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card/90 p-4 text-card-foreground shadow-lg sm:p-8">
          <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            F1 DELHI NCR COMMUNITY FANTASY
          </p>
          <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.25em] text-gradient-red">
            RESET PASSWORD
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your email and we’ll send you a link to reset your password.
          </p>

          {forgotSent ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                If an account exists for that email, you’ll receive a link shortly.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full font-racing tracking-[0.2em]"
                onClick={() => { setForgotMode(false); setForgotSent(false); }}
              >
                BACK TO SIGN IN
              </Button>
            </>
          ) : (
            <form className="space-y-4" onSubmit={handleForgotSubmit}>
              <div className="space-y-1 text-sm">
                <label htmlFor="forgot-email" className="text-xs font-medium uppercase tracking-[0.18em]">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail || email}
                  onChange={(e) => { setForgotEmail(e.target.value); setEmail(e.target.value); }}
                  className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-0"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="mt-4 w-full font-racing tracking-[0.2em]" disabled={loading}>
                {loading ? "Sending…" : "SEND RESET LINK"}
              </Button>
              <button
                type="button"
                className="mt-2 w-full text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                onClick={() => { setForgotMode(false); setForgotSent(false); }}
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg-sharp relative flex min-h-screen items-center justify-center px-3 pt-20 pb-8 sm:pt-24" style={loginBg}>
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card/90 p-4 text-card-foreground shadow-lg sm:p-8">
        <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          F1 DELHI NCR COMMUNITY FANTASY
        </p>
        <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.25em] text-gradient-red">
          SIGN IN
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Connect your account to save teams, track your rank, and sync across devices.
        </p>

        <form className="space-y-4" onSubmit={handleSignIn}>
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
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keep-logged-in"
                checked={keepLoggedIn}
                onCheckedChange={(checked) => setKeepLoggedIn(!!checked)}
              />
              <label
                htmlFor="keep-logged-in"
                className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground cursor-pointer select-none hover:text-foreground"
              >
                Keep me logged in
              </label>
            </div>
            <button
              type="button"
              className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
              onClick={() => setForgotMode(true)}
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="mt-4 w-full font-racing tracking-[0.2em]" disabled={loading}>
            {loading ? "Signing in…" : "CONTINUE"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium uppercase tracking-[0.18em] text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
