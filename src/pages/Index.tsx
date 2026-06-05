import { useState, useEffect, useMemo } from "react";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedule, getNextRace, getNextLockCloseUtc } from "@/data/schedule";

function formatLockInIst(utc: Date): string {
  const date = utc.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const time = utc.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  return `${date} • ${time} IST`;
}

const Index = () => {
  const [now, setNow] = useState(() => new Date());
  const { data: scheduleData } = useQuery({ queryKey: ["schedule"], queryFn: fetchSchedule });
  const races = scheduleData?.races ?? [];
  const season = scheduleData?.season ?? "2026";

  const nextRace = useMemo(() => getNextRace(races, now), [races, now]);
  const nextLockClose = useMemo(() => getNextLockCloseUtc(races, now), [races, now]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const nextLockInLabel = nextLockClose ? formatLockInIst(nextLockClose) : "—";

  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16">
        {/* Hero */}
        <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
              SEASON {season}
            </p>
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <img
                src="/f1-logo.png"
                alt="Formula 1"
                className="f1-logo-transparent h-14 w-auto object-contain sm:h-16 lg:h-20"
              />
              <h1 className="font-f1 text-4xl tracking-[0.12em] text-gradient-red sm:text-5xl lg:text-6xl">
                F1 FANTASY
                <br />
                DELHI NCR
              </h1>
            </div>
            <p className="mb-6 max-w-xl text-sm text-muted-foreground sm:text-base">
              Build your dream team of 5 drivers. Compete against the Delhi NCR community. Climb the
              leaderboard every race weekend.
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button size="lg" className="min-h-[44px] w-full font-racing tracking-[0.2em] sm:w-auto" asChild>
                <Link to="/my-team">
                  <Users className="mr-2 h-4 w-4 shrink-0" />
                  CREATE YOUR TEAM
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="min-h-[44px] w-full border border-border/60 bg-background/40 font-racing tracking-[0.2em] sm:w-auto"
                asChild
              >
                <Link to="/leaderboard">
                  LEADERBOARD
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 text-xs sm:grid-cols-3 sm:text-sm">
              <div className="rounded-lg border border-border/60 bg-background/40 p-3 sm:p-4">
                <p className="mb-1 text-muted-foreground">Season</p>
                <p className="font-racing text-lg font-bold text-gradient-gold">{season} World Championship</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/40 p-3 sm:p-4">
                <p className="mb-1 text-muted-foreground">Race weekends</p>
                <p className="font-racing text-lg font-bold text-gradient-gold">Every Grand Prix</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/40 p-3 sm:p-4">
                <p className="mb-1 text-muted-foreground">Next lock-in</p>
                <p className="font-racing text-lg font-bold text-gradient-gold">
                  {nextLockInLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Next race / highlight card – driven by schedule and current time */}
          <Card className="glow-red border-primary/40 bg-gradient-to-br from-background to-background/40">
            <CardHeader>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Next Race
              </p>
              <CardTitle className="font-racing text-2xl tracking-[0.15em]">
                {nextRace ? nextRace.name : "—"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {nextRace
                  ? `Lock in your team before Q1. Next race for the ${season} season.`
                  : races.length > 0
                    ? "Season complete. See you next year."
                    : "Schedule loading…"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {nextRace ? (
                <>
                  <div className="grid gap-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3">
                      <span className="text-muted-foreground">Circuit</span>
                      <span className="font-medium">{nextRace.circuit || nextRace.location}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3">
                      <span className="text-muted-foreground">Race</span>
                      <span className="font-medium">{nextRace.date} {nextRace.localTime ? `• ${nextRace.localTime}` : ""}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3">
                      <span className="text-muted-foreground">Lock-in (Q1)</span>
                      <span className="font-medium">{nextLockClose ? formatLockInIst(nextLockClose) : "—"}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-racing text-xs tracking-[0.2em]"
                    asChild
                  >
                    <Link to="/schedule">FULL SCHEDULE</Link>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-racing text-xs tracking-[0.2em]"
                  asChild
                >
                  <Link to="/schedule">FULL SCHEDULE</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        {/* How it works */}
        <section className="mt-16 space-y-8">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
              HOW IT WORKS
            </p>
            <h2 className="font-racing text-2xl font-bold tracking-[0.15em] text-foreground sm:text-3xl">
              Three steps to F1 glory in the Delhi NCR community
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/60 bg-background/60">
              <CardHeader>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">01</p>
                <CardTitle className="text-sm font-semibold">Pick Your Drivers</CardTitle>
                <CardDescription className="text-xs">
                  Select 5 drivers from the 2025 grid within the budget cap. Choose wisely!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/60 bg-background/60">
              <CardHeader>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">02</p>
                <CardTitle className="text-sm font-semibold">Race Weekend</CardTitle>
                <CardDescription className="text-xs">
                  Your drivers earn points based on real F1 race results every weekend.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/60 bg-background/60">
              <CardHeader>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">03</p>
                <CardTitle className="text-sm font-semibold">Climb the Board</CardTitle>
                <CardDescription className="text-xs">
                  Compare scores with the community. Top the leaderboard to claim bragging rights!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16 rounded-xl border border-border/60 bg-background/60 p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
                READY TO RACE?
              </p>
              <h3 className="font-racing text-2xl font-bold tracking-[0.15em] text-foreground sm:text-3xl">
                Join the Delhi NCR F1 community and start building your fantasy team today.
              </h3>
            </div>
            <Button size="lg" className="font-racing tracking-[0.2em]" asChild>
              <Link to="/my-team">GET STARTED</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
