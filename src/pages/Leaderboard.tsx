import { useState } from "react";
import { Trophy, Crown, Users, Calendar, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fetchSeasonLeaderboard,
  fetchRaceLeaderboard,
  fetchLeaderboardHistory,
  isApiConfigured,
  type LeaderboardEntry,
  type LeaderboardHistoryEntry,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSchedule } from "@/data/schedule";

type Tab = "season" | "race";

const LeaderboardTable = ({
  rows,
  username,
  emptyMessage,
}: {
  rows: LeaderboardEntry[];
  username: string | null;
  emptyMessage: string;
}) => (
  <>
    <div className="grid grid-cols-[3rem_1fr_4rem] gap-3 border-t border-border/60 px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
      <span>#</span>
      <span>Team</span>
      <span className="text-right">Pts</span>
    </div>
    <div className="divide-y divide-border/60">
      {rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
      ) : (
        rows.map((row) => (
          <div
            key={`${row.username}-${row.rank}`}
            className={`grid grid-cols-[3rem_1fr_4rem] items-center gap-3 px-4 py-2 text-sm ${
              username === row.username ? "bg-primary/5" : ""
            }`}
          >
            <span className="font-racing text-xs text-muted-foreground">{row.rank}</span>
            <span className="truncate text-sm font-medium text-foreground">{row.username}</span>
            <span className="text-right font-racing text-sm text-gradient-gold">{row.points}</span>
          </div>
        ))
      )}
    </div>
  </>
);

const Leaderboard = () => {
  const { user, username } = useAuth();
  const [tab, setTab] = useState<Tab>("season");
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  const { data: scheduleData } = useQuery({ queryKey: ["schedule"], queryFn: fetchSchedule });
  const races = scheduleData?.races ?? [];

  const {
    data: seasonLeaderboard = [],
    isLoading: seasonLoading,
    isError: seasonError,
    error: seasonErrorObj,
  } = useQuery({
    queryKey: ["leaderboard", "season"],
    queryFn: fetchSeasonLeaderboard,
    enabled: isApiConfigured() && tab === "season",
  });

  const { data: history = [] } = useQuery({
    queryKey: ["leaderboard", "history"],
    queryFn: fetchLeaderboardHistory,
    enabled: isApiConfigured(),
  });

  const roundToFetch = tab === "race" ? selectedRound || (history[0]?.round ?? null) : null;
  const {
    data: raceLeaderboard = [],
    isLoading: raceLoading,
    isError: raceError,
    error: raceErrorObj,
  } = useQuery({
    queryKey: ["leaderboard", "race", roundToFetch ?? ""],
    queryFn: () => fetchRaceLeaderboard(roundToFetch!),
    enabled: isApiConfigured() && tab === "race" && !!roundToFetch,
  });

  const seasonRank = username ? seasonLeaderboard.find((e) => e.username === username)?.rank : null;
  const seasonPoints = username ? seasonLeaderboard.find((e) => e.username === username)?.points : null;
  const raceRank = username ? raceLeaderboard.find((e) => e.username === username)?.rank : null;
  const racePoints = username ? raceLeaderboard.find((e) => e.username === username)?.points : null;

  return (
    <div className="min-h-screen bg-carbon pt-24">
      <div className="container mx-auto px-4 pb-16">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
              GLOBAL STANDINGS
            </p>
            <h1 className="font-racing text-3xl font-bold tracking-[0.2em] text-gradient-gold sm:text-4xl">
              LEADERBOARD
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-3 py-1">
              <Trophy className="h-3.5 w-3.5 text-accent" />
              <span>Every race is a new chance to climb.</span>
            </div>
          </div>
        </header>

        {!isApiConfigured() && (
          <Card className="border-border/60 bg-background/60 p-6">
            <p className="text-sm text-muted-foreground">
              Set VITE_API_URL in .env and start the backend to see season and race leaderboards.
            </p>
          </Card>
        )}

        {isApiConfigured() && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-border/60 pb-2">
                <button
                  type="button"
                  onClick={() => setTab("season")}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                    tab === "season"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Crown className="h-3.5 w-3.5" />
                  Season
                </button>
                <button
                  type="button"
                  onClick={() => setTab("race")}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                    tab === "race"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Race
                </button>
              </div>

              <Card className="border-border/60 bg-background/60">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-semibold tracking-wide">
                      {tab === "season" ? "Season leaderboard" : "Race leaderboard"}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tab === "season"
                        ? "Cumulative points from all closed race weekends."
                        : "Stored after each race weekend. Pick a race below."}
                    </p>
                  </div>
                  <Badge className="flex items-center gap-1 bg-primary/10 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-primary">
                    <Crown className="h-3 w-3" />
                    {tab === "season" ? "SEASON" : "RACE"}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {tab === "season" && (
                    <>
                      {seasonLoading && (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                          Loading…
                        </div>
                      )}
                      {seasonError && (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                          Season leaderboard is temporarily unavailable. Standings will appear after the
                          first race weekend is processed.
                        </div>
                      )}
                      {!seasonLoading && !seasonError && (
                        <LeaderboardTable
                          rows={seasonLeaderboard}
                          username={username}
                          emptyMessage="No season data yet. Race leaderboards are stored when a weekend is closed."
                        />
                      )}
                    </>
                  )}
                  {tab === "race" && (
                    <>
                      <div className="border-t border-border/60 px-4 py-2">
                        <label className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          Select race
                        </label>
                        <select
                          value={selectedRound ?? (history[0]?.round ?? "")}
                          onChange={(e) => setSelectedRound(e.target.value || null)}
                          className="mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                        >
                          {history.length === 0 && (
                            <option value="">No closed races yet</option>
                          )}
                          {history.map((h: LeaderboardHistoryEntry) => (
                            <option key={h.round} value={h.round}>
                              R{h.round} – {h.race_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {raceLoading && (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                          Loading…
                        </div>
                      )}
                      {raceError && (
                        <div className="px-4 py-6 text-center text-sm text-destructive">
                          {raceErrorObj instanceof Error ? raceErrorObj.message : "Failed to load"}
                        </div>
                      )}
                      {!raceLoading && !raceError && (
                        <LeaderboardTable
                          rows={raceLeaderboard}
                          username={username}
                          emptyMessage="No entries for this race yet."
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {history.length > 0 && (
                <Card className="border-border/60 bg-background/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <History className="h-4 w-4 text-muted-foreground" />
                      Race history
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Past race leaderboards (stored after each weekend).
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      {history.map((h: LeaderboardHistoryEntry) => (
                        <li key={h.round}>
                          <button
                            type="button"
                            onClick={() => {
                              setTab("race");
                              setSelectedRound(h.round);
                            }}
                            className="text-primary hover:underline"
                          >
                            Round {h.round} – {h.race_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="border-border/60 bg-background/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Your position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {!user ? (
                  <>
                    <p>Sign in to see your rank on season and race leaderboards.</p>
                    <div className="rounded-lg border border-dashed border-border/80 bg-background/40 p-4 text-xs">
                      <p className="mb-1 font-medium text-foreground">Not signed in</p>
                      <p className="text-muted-foreground">
                        Sign in and lock in your team to appear on the leaderboards.
                      </p>
                    </div>
                  </>
                ) : !username ? (
                  <div className="rounded-lg border border-dashed border-border/80 bg-background/40 p-4 text-xs">
                    <p className="mb-1 font-medium text-foreground">Set your username</p>
                    <p className="text-muted-foreground">
                      Add a username in Profile to lock in your team and appear here.
                    </p>
                  </div>
                ) : tab === "season" && (seasonRank != null || seasonPoints != null) ? (
                  <div className="rounded-lg border border-border/80 bg-background/40 p-4">
                    <p className="mb-1 font-medium text-foreground">Season</p>
                    <p className="font-racing text-2xl text-gradient-gold">#{seasonRank ?? "–"}</p>
                    <p className="text-xs text-muted-foreground">{seasonPoints ?? 0} pts</p>
                  </div>
                ) : tab === "race" && (raceRank != null || racePoints != null) ? (
                  <div className="rounded-lg border border-border/80 bg-background/40 p-4">
                    <p className="mb-1 font-medium text-foreground">This race</p>
                    <p className="font-racing text-2xl text-gradient-gold">#{raceRank ?? "–"}</p>
                    <p className="text-xs text-muted-foreground">{racePoints ?? 0} pts</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/80 bg-background/40 p-4 text-xs">
                    <p className="mb-1 font-medium text-foreground">No team submitted yet</p>
                    <p className="text-muted-foreground">
                      Lock in your team on My Team to get scores and appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
