import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, History, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { checkUsernameAvailable, createProfile } from "@/lib/supabase";

const Profile = () => {
  const { user, username, profileLoading, loading: authLoading } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [settingUsername, setSettingUsername] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24 flex items-center justify-center">
        <div className="relative w-full max-w-xs p-6 bg-card/65 border border-primary/20 rounded-xl text-center shadow-[0_0_40px_rgba(225,6,0,0.18)] overflow-hidden">
          {/* Neon racing red accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-500 animate-pulse" />
          
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_15px_rgba(225,6,0,0.1)]">
            {/* Pulsing tachometer styled indicator */}
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
          
          <p className="text-xs font-racing uppercase tracking-[0.25em] text-primary animate-pulse font-bold">
            LOADING TELEMETRY...
          </p>
          <div className="mt-4 w-full bg-secondary/50 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-1/3 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-3 pb-12 sm:px-4 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <Card className="border border-border/70 bg-card/90 p-4 sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <User className="h-7 w-7" />
              </div>
              <h1 className="mb-2 font-racing text-2xl font-bold tracking-[0.2em] text-gradient-red">
                YOUR PROFILE
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Sign in to view your profile, team history, and previous race entries.
              </p>
              <Button asChild className="font-racing tracking-[0.2em]">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  LOG IN
                </Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.2em] text-gradient-red sm:text-4xl">
            PROFILE
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Your account and fantasy team history.
          </p>

          <Card className="mb-8 overflow-hidden border-border/70 bg-card/90">
            <div className="border-b border-border bg-secondary/50 p-4">
              <h2 className="font-racing text-sm font-bold tracking-wider text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                ACCOUNT
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
              {profileLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-secondary-foreground/20" />
                  <div className="h-5 w-40 animate-pulse rounded bg-secondary-foreground/10" />
                </div>
              ) : username ? (
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium text-foreground">{username}</p>
                  <p className="text-xs text-muted-foreground">Shown on leaderboard. One per person.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Choose your username</p>
                  <form
                    className="flex gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const un = newUsername.trim();
                      if (!un || un.length < 2 || un.length > 24) {
                        toast.error("Username must be 2–24 characters.");
                        return;
                      }
                      const available = await checkUsernameAvailable(un);
                      if (!available) {
                        toast.error("This username is already taken.");
                        return;
                      }
                      setSettingUsername(true);
                      const { error } = await createProfile(user.id, un);
                      setSettingUsername(false);
                      if (error) {
                        toast.error(error);
                        return;
                      }
                      toast.success("Username set.");
                      window.location.reload();
                    }}
                  >
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. speedster_fan"
                      className="h-9 flex-1 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary"
                      minLength={2}
                      maxLength={24}
                    />
                    <Button type="submit" disabled={settingUsername} className="font-racing tracking-wider">
                      {settingUsername ? "Saving…" : "Set username"}
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-1">One username per person. You need this to lock in your team.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden border-border/70 bg-card/90">
            <div className="border-b border-border bg-secondary/50 p-4">
              <h2 className="font-racing text-sm font-bold tracking-wider text-foreground flex items-center gap-2">
                <History className="h-4 w-4" />
                RACE HISTORY & LEADERBOARDS
              </h2>
            </div>
            <div className="p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                View the <strong>season leaderboard</strong> (cumulative points), <strong>race leaderboards</strong> (per weekend, stored after each race), and <strong>race history</strong> on the Leaderboard page.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="font-racing tracking-wider">
                  <Link to="/leaderboard">Season & race leaderboards</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="font-racing tracking-wider">
                  <Link to="/my-team">Build your team</Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
