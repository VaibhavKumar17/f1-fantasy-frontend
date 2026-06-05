import { useEffect, useState, useMemo } from "react";
import { Trophy, Crown, Users, Calendar, History, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchSeasonLeaderboard,
  fetchRaceLeaderboard,
  fetchLeaderboardHistory,
  fetchRoundTeams,
  isApiConfigured,
  type LeaderboardEntry,
  type LeaderboardHistoryEntry,
  type RoundTeamsResponse,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSchedule } from "@/data/schedule";
import { drivers as staticDrivers } from "@/data/drivers";
import { constructors as staticConstructors } from "@/data/constructors";

const getDriverDetails = (id: string) => {
  const normalizedId = id.trim().toLowerCase();
  return staticDrivers.find(d => d.id.toLowerCase() === normalizedId) || {
    name: id.charAt(0).toUpperCase() + id.slice(1),
    flag: "🏎️",
    teamColor: "#999"
  };
};

const getConstructorDetails = (id: string) => {
  const normalizedId = id.trim().toLowerCase();
  return staticConstructors.find(c => c.id.toLowerCase() === normalizedId || c.name.toLowerCase() === normalizedId) || {
    name: id.charAt(0).toUpperCase() + id.slice(1)
  };
};


type Tab = "season" | "race";

const LeaderboardTable = ({
  rows,
  username,
  emptyMessage,
  onRowClick,
}: {
  rows: LeaderboardEntry[];
  username: string | null;
  emptyMessage: string;
  onRowClick?: (username: string) => void;
}) => (
  <>
    <div className="grid grid-cols-[2.5rem_1fr_auto_3rem] gap-2 border-t border-border/60 px-3 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-[3rem_1fr_auto_4rem] sm:gap-3 sm:px-4 sm:text-[0.7rem]">
      <span>#</span>
      <span>Team</span>
      <span className="opacity-0">Inspect</span>
      <span className="text-right">Pts</span>
    </div>
    <div className="divide-y divide-border/60">
      {rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
      ) : (
        rows.map((row) => (
          <div
            key={`${row.username}-${row.rank}`}
            className={`group grid grid-cols-[2.5rem_1fr_auto_3rem] items-center gap-2 px-3 py-2.5 text-xs sm:grid-cols-[3rem_1fr_auto_4rem] sm:gap-3 sm:px-4 sm:text-sm transition-all duration-150 ${
              username === row.username ? "bg-primary/5 border-l-2 border-primary" : "border-l-2 border-transparent"
            } ${onRowClick ? "cursor-pointer hover:bg-secondary/40 hover:translate-x-1" : ""}`}
            onClick={onRowClick ? () => onRowClick(row.username) : undefined}
          >
            <span className="font-racing text-xs text-muted-foreground">{row.rank}</span>
            <span className="truncate text-sm font-medium text-foreground flex items-center gap-2">
              {row.username}
              {username === row.username && (
                <span className="text-[0.55rem] bg-primary/10 border border-primary/20 text-primary px-1 rounded font-bold uppercase tracking-wider scale-90">
                  YOU
                </span>
              )}
            </span>
            {onRowClick && (
              <span className="text-[0.6rem] font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                Inspect Team
              </span>
            )}
            <span className="text-right font-racing text-sm text-gradient-gold">{row.points}</span>
          </div>
        ))
      )}
    </div>
  </>
);

const Leaderboard = () => {
  const { user, username, profileLoading } = useAuth();
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [selectedUserTeam, setSelectedUserTeam] = useState<string | null>(null);
  const [inspectedRound, setInspectedRound] = useState<string | null>(null);

  const { data: scheduleData } = useQuery({ queryKey: ["schedule"], queryFn: fetchSchedule });
  const races = scheduleData?.races ?? [];

  const activeRound = useMemo(() => {
    if (!races.length) return null;
    const now = new Date();
    // 1) Check if currently locked (between qualifying and race)
    for (const r of races) {
      if (!r.qualifyingDateUtc || !r.dateTimeUtc) continue;
      const q = new Date(r.qualifyingDateUtc);
      const race = new Date(r.dateTimeUtc);
      if (q <= now && now < race) return r.round;
    }
    // 2) Check next upcoming (first qualifying in future)
    for (const r of races) {
      if (!r.qualifyingDateUtc) continue;
      const q = new Date(r.qualifyingDateUtc);
      if (q > now) return r.round;
    }
    // 3) Fallback
    return races[races.length - 1]?.round ?? null;
  }, [races]);

  const activeRaceName = useMemo(() => {
    if (!activeRound || !races.length) return "";
    const race = races.find((r) => r.round === activeRound);
    return race ? race.name : `Round ${activeRound}`;
  }, [activeRound, races]);

  const isWeekendActive = useMemo(() => {
    if (!activeRound || !races.length) return false;
    const activeRace = races.find((r) => r.round === activeRound);
    if (!activeRace || !activeRace.qualifyingDateUtc || !activeRace.dateTimeUtc) return false;
    const now = new Date();
    const qStart = new Date(activeRace.qualifyingDateUtc);
    const rStart = new Date(activeRace.dateTimeUtc);
    
    // 24 hours before Q1
    const windowStart = new Date(qStart.getTime() - 24 * 60 * 60 * 1000);
    // 4 hours after race start
    const windowEnd = new Date(rStart.getTime() + 4 * 60 * 60 * 1000);
    
    return now >= windowStart && now <= windowEnd;
  }, [activeRound, races]);

  const [leaderboardType, setLeaderboardType] = useState<"combined" | "wdc" | "wcc">("combined");

  const {
    data: seasonLeaderboard = [],
    isLoading: seasonLoading,
    isError: seasonError,
  } = useQuery({
    queryKey: ["leaderboard", "season", leaderboardType],
    queryFn: () => fetchSeasonLeaderboard(leaderboardType),
    enabled: isApiConfigured(),
  });

  const { data: history = [] } = useQuery({
    queryKey: ["leaderboard", "history"],
    queryFn: fetchLeaderboardHistory,
    enabled: isApiConfigured(),
  });

  const defaultRound = (history && history.length > 0)
    ? history[history.length - 1].round
    : (activeRound || "");

  const roundToFetch = selectedRound || defaultRound;

  const {
    data: currentRaceLeaderboard = [],
    isLoading: currentRaceLoading,
    isError: currentRaceError,
    error: currentRaceErrorObj,
  } = useQuery({
    queryKey: ["leaderboard", "race", activeRound ?? "", leaderboardType],
    queryFn: () => fetchRaceLeaderboard(activeRound!, leaderboardType),
    enabled: isApiConfigured() && !!activeRound,
  });

  const {
    data: pastRaceLeaderboard = [],
    isLoading: pastRaceLoading,
    isError: pastRaceError,
    error: pastRaceErrorObj,
  } = useQuery({
    queryKey: ["leaderboard", "race", roundToFetch ?? "", leaderboardType],
    queryFn: () => fetchRaceLeaderboard(roundToFetch!, leaderboardType),
    enabled: isApiConfigured() && !!roundToFetch,
  });

  const targetRound = inspectedRound || activeRound;

  const { data: inspectedRoundTeamData, isLoading: loadingInspectedTeam } = useQuery({
    queryKey: ["roundTeams", targetRound ?? "", username ?? ""],
    queryFn: () => fetchRoundTeams(targetRound!, username || undefined),
    enabled: isApiConfigured() && !!targetRound,
  });

  const { data: roundResults } = useQuery({
    queryKey: ["raceResults", targetRound ?? ""],
    queryFn: async () => {
      if (!targetRound) return null;
      const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "";
      if (!base) return null;
      const res = await fetch(`${base}/race-results/${targetRound}`);
      if (!res.ok) return null;
      return res.json() as Promise<{
        drivers: Record<string, number>;
        constructors: Record<string, number>;
      }>;
    },
    enabled: isApiConfigured() && !!targetRound,
  });

  const getDriverPoints = (driverId: string) => {
    if (!roundResults?.drivers || Object.keys(roundResults.drivers).length === 0) return "Pending";
    const position = roundResults.drivers[driverId];
    if (position === undefined || position === null) return "0 pts (DNF)";
    const pointsMap: Record<number, number> = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 };
    const pts = pointsMap[position] ?? 0;
    return `${pts} pts (P${position})`;
  };

  const getConstructorPoints = (cId: string) => {
    if (!roundResults?.constructors || Object.keys(roundResults.constructors).length === 0) return "Pending";
    const pts = roundResults.constructors[cId];
    if (pts === undefined || pts === null) return "0 pts";
    return `${pts} pts`;
  };

  const seasonRank = username ? seasonLeaderboard.find((e) => e.username === username)?.rank : null;
  const seasonPoints = username ? seasonLeaderboard.find((e) => e.username === username)?.points : null;
  const currentRaceRank = username ? currentRaceLeaderboard.find((e) => e.username === username)?.rank : null;
  const currentRacePoints = username ? currentRaceLeaderboard.find((e) => e.username === username)?.points : null;

  const handleSelectRow = (clickedUsername: string, roundId: string | null) => {
    setSelectedUserTeam(clickedUsername);
    setInspectedRound(roundId);
  };

  const handleClearInspect = () => {
    setSelectedUserTeam(null);
    setInspectedRound(activeRound);
  };

  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
              GLOBAL STANDINGS
            </p>
            <h1 className="font-racing text-3xl font-bold tracking-[0.2em] text-gradient-gold sm:text-4xl">
              LEADERBOARD
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLeaderboardType("combined")}
              className={`px-3 py-1.5 rounded text-[0.65rem] font-racing font-bold tracking-wider uppercase border transition-all ${
                leaderboardType === "combined"
                  ? "bg-primary border-primary text-white glow-red"
                  : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              🏁 Combined (WDC+WCC)
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardType("wdc")}
              className={`px-3 py-1.5 rounded text-[0.65rem] font-racing font-bold tracking-wider uppercase border transition-all ${
                leaderboardType === "wdc"
                  ? "bg-primary border-primary text-white glow-red"
                  : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              🏎️ Drivers (WDC)
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardType("wcc")}
              className={`px-3 py-1.5 rounded text-[0.65rem] font-racing font-bold tracking-wider uppercase border transition-all ${
                leaderboardType === "wcc"
                  ? "bg-primary border-primary text-white glow-red"
                  : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              🛠️ Constructors (WCC)
            </button>
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
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {/* Left Section: Three Leaderboards layout */}
            <div className="order-2 space-y-6 lg:order-1">
              
              {/* 1. Primary Leaderboard Card */}
              <Card className="border-2 border-primary/30 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                  <div>
                    <CardTitle className="text-base font-bold tracking-wide flex items-center gap-2">
                      {isWeekendActive ? (
                        <>
                          <Calendar className="h-4 w-4 text-primary animate-pulse" />
                          <span>Current Race: {activeRaceName || `Round ${activeRound}`}</span>
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 text-gradient-gold" />
                          <span>Season Standings</span>
                        </>
                      )}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {isWeekendActive
                        ? "Active race weekend standings. Click any player below to inspect setup!"
                        : "Cumulative points from all closed race weekends."}
                    </p>
                  </div>
                  <Badge className={`flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] ${isWeekendActive ? "bg-primary/20 text-primary border border-primary/30 animate-pulse" : "bg-primary/10 text-primary border border-primary/20"}`}>
                    {isWeekendActive ? "WEEKEND ACTIVE" : "SEASON PRIMARY"}
                  </Badge>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="border-t border-border/60 px-4 py-2 text-[0.65rem] text-primary/80 font-medium flex items-center gap-1.5 animate-pulse bg-primary/5">
                    <span>💡</span>
                    <span>Click any player below to inspect their lineup in the paddock card!</span>
                  </div>

                  {isWeekendActive ? (
                    currentRaceLoading ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading current race standings…</div>
                    ) : currentRaceError ? (
                      <div className="px-4 py-8 text-center text-sm text-destructive">
                        {currentRaceErrorObj instanceof Error ? currentRaceErrorObj.message : "Failed to load current race standings"}
                      </div>
                    ) : (
                      <LeaderboardTable
                        rows={currentRaceLeaderboard}
                        username={username}
                        emptyMessage="No current race standings recorded yet."
                        onRowClick={(clickedUser) => handleSelectRow(clickedUser, activeRound)}
                      />
                    )
                  ) : (
                    seasonLoading ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading season standings…</div>
                    ) : seasonError ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Season standings are temporarily unavailable.
                      </div>
                    ) : (
                      <LeaderboardTable
                        rows={seasonLeaderboard}
                        username={username}
                        emptyMessage="No season standings recorded yet."
                        onRowClick={(clickedUser) => handleSelectRow(clickedUser, activeRound)}
                      />
                    )
                  )}
                </CardContent>
              </Card>

              {/* 2. Split Secondary Grid (Season/Current and Past) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Secondary A: Opposite of Primary */}
                <Card className="border border-border/60 bg-background/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-border">
                  <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                    <div>
                      <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
                        {isWeekendActive ? (
                          <>
                            <Crown className="h-4 w-4 text-muted-foreground" />
                            <span>Season Standings</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Current Race: {activeRaceName || `Round ${activeRound}`}</span>
                          </>
                        )}
                      </CardTitle>
                      <p className="mt-1 text-[0.65rem] text-muted-foreground leading-normal">
                        {isWeekendActive
                          ? "Cumulative points from all closed race weekends."
                          : "Qualifying starts soon. Standings update during active weekend."}
                      </p>
                    </div>
                    <Badge className="bg-secondary/80 text-muted-foreground border border-border text-[0.6rem] font-bold uppercase tracking-wider">
                      {isWeekendActive ? "SEASON" : "RACE"}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {isWeekendActive ? (
                      seasonLoading ? (
                        <div className="px-4 py-6 text-center text-xs text-muted-foreground">Loading season standings…</div>
                      ) : seasonError ? (
                        <div className="px-4 py-6 text-center text-xs text-muted-foreground">Season standings unavailable.</div>
                      ) : (
                        <LeaderboardTable
                          rows={seasonLeaderboard}
                          username={username}
                          emptyMessage="No season standings recorded yet."
                          onRowClick={(clickedUser) => handleSelectRow(clickedUser, activeRound)}
                        />
                      )
                    ) : (
                      currentRaceLoading ? (
                        <div className="px-4 py-6 text-center text-xs text-muted-foreground">Loading current race standings…</div>
                      ) : currentRaceError ? (
                        <div className="px-4 py-6 text-center text-xs text-destructive">Failed to load race standings</div>
                      ) : (
                        <LeaderboardTable
                          rows={currentRaceLeaderboard}
                          username={username}
                          emptyMessage="No current race standings recorded yet."
                          onRowClick={(clickedUser) => handleSelectRow(clickedUser, activeRound)}
                        />
                      )
                    )}
                  </CardContent>
                </Card>

                {/* Secondary B: Past Races with Dropdown */}
                <Card className="border border-border/60 bg-background/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-border">
                  <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <span>Past Races</span>
                      </CardTitle>
                      <p className="mt-1 text-[0.65rem] text-muted-foreground leading-normal">
                        Completed rounds. Select to view standings.
                      </p>
                    </div>
                    <div className="w-24 sm:w-32">
                      <select
                        value={selectedRound ?? defaultRound}
                        onChange={(e) => {
                          const next = e.target.value || null;
                          setSelectedRound(next);
                        }}
                        className="w-full rounded border border-border bg-background/80 px-2 py-1 text-[0.7rem] font-medium text-foreground outline-none focus:border-primary"
                      >
                        {history.length === 0 && (
                          <option value="">No history</option>
                        )}
                        {history.map((h: LeaderboardHistoryEntry) => (
                          <option key={h.round} value={h.round}>
                            R{h.round} – {h.race_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {pastRaceLoading ? (
                      <div className="px-4 py-6 text-center text-xs text-muted-foreground">Loading past race standings…</div>
                    ) : pastRaceError ? (
                      <div className="px-4 py-6 text-center text-xs text-destructive">Failed to load past standings</div>
                    ) : (
                      <LeaderboardTable
                        rows={pastRaceLeaderboard}
                        username={username}
                        emptyMessage="No past race standings recorded yet."
                        onRowClick={(clickedUser) => handleSelectRow(clickedUser, roundToFetch)}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Section: Locked Team + User standing */}
            <div className="order-1 space-y-4 lg:order-2">
              <Card className="border-border/60 bg-background/60">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Your position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  {profileLoading ? (
                    <div className="space-y-2 animate-pulse py-2">
                      <div className="h-4 bg-secondary/80 rounded w-1/3" />
                      <div className="h-8 bg-secondary/80 rounded w-1/2" />
                    </div>
                  ) : !user ? (
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
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border/80 bg-background/40 p-3">
                        <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">Season Standing</p>
                        <p className="font-racing text-2xl text-gradient-gold">#{seasonRank ?? "–"}</p>
                        <p className="text-xs text-muted-foreground">{seasonPoints ?? 0} pts</p>
                      </div>
                      <div className="rounded-lg border border-border/80 bg-background/40 p-3">
                        <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">Current Race</p>
                        <p className="font-racing text-2xl text-gradient-gold">#{currentRaceRank ?? "–"}</p>
                        <p className="text-xs text-muted-foreground">{currentRacePoints ?? 0} pts</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Locked Roster / Team Details Card */}
              {user && (
                <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-accent/5 shadow-xl glow-red overflow-hidden relative">
                  <div className="absolute inset-0 bg-carbon opacity-20 pointer-events-none" />
                  <CardHeader className="border-b border-border bg-black/40 relative z-10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="bg-primary text-[0.6rem] font-bold tracking-[0.25em] text-white px-2 py-0.5 mb-1 animate-pulse">
                          PADDOCK LIVE
                        </Badge>
                        <CardTitle className="font-racing text-sm font-bold tracking-wider text-foreground uppercase">
                          {targetRound === activeRound ? "ACTIVE LOCK-IN TEAM" : "ROUND ROSTER"}
                        </CardTitle>
                        <p className="font-racing text-[0.7rem] text-muted-foreground mt-0.5 tracking-wide">
                          {activeRound && races.length > 0 ? (
                            targetRound === activeRound ? (
                              `R${activeRound} • ${activeRaceName || "Loading..."}`
                            ) : (
                              `R${targetRound} • ${races.find(r => r.round === targetRound)?.name || `Round ${targetRound}`}`
                            )
                          ) : "No Round Selected"}
                        </p>
                      </div>
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 relative z-10 space-y-4">
                    {(profileLoading || loadingInspectedTeam) ? (
                      <div className="py-6 text-center text-xs text-muted-foreground font-mono animate-pulse">
                        📡 CONNECTING TO GARAGE TELEMETRY...
                      </div>
                    ) : !username ? (
                      <div className="text-center py-6 px-4 rounded-lg bg-secondary/20 border border-dashed border-border/80 text-xs">
                        <p className="font-semibold text-foreground mb-1">USERNAME REQUIRED</p>
                        <p className="text-muted-foreground">
                          Set your username in Profile to initialize your garage telemetry.
                        </p>
                      </div>
                    ) : (() => {
                      const targetUser = selectedUserTeam || username || "";
                      const isSelf = !selectedUserTeam || selectedUserTeam === username;
                      const isLocked = targetRound === activeRound ? !!inspectedRoundTeamData?.locked : true;

                      if (!isSelf && !isLocked && targetUser) {
                        return (
                          <div className="text-center py-6 px-4 rounded-lg bg-secondary/35 border border-amber-500/20 space-y-4">
                            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500 text-amber-500 animate-pulse">
                              <span className="text-xl">🤫</span>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-racing font-bold text-amber-400 text-xs tracking-widest uppercase">
                                SANDBAGGING!
                              </h3>
                              <p className="text-[0.7rem] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                <strong className="text-foreground">@{targetUser}</strong> is keeping their telemetry classified. Rival setups are unlocked once the round is locked (Q1 starts)!
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleClearInspect}
                              className="font-racing text-[0.7rem] tracking-wider border-amber-500/40 text-amber-200 hover:bg-amber-500/10 w-full animate-pulse"
                            >
                              ⬅️ RETURN TO MY GARAGE
                            </Button>
                          </div>
                        );
                      }

                      const displayTeam = inspectedRoundTeamData?.teams?.find((t) => t.username === targetUser);

                      if (!displayTeam) {
                        if (isSelf) {
                          const isRoundLockedOrClosed = targetRound === activeRound ? !!inspectedRoundTeamData?.locked : true;
                          const currentRoundLabel = `Round ${targetRound}`;
                          
                          if (isRoundLockedOrClosed && targetRound !== activeRound) {
                            return (
                              <div className="text-center py-6 px-4 rounded-lg bg-secondary/35 border border-border/80 space-y-3">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-secondary border border-border text-muted-foreground">
                                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="font-racing font-bold text-foreground text-xs tracking-widest uppercase">
                                    DID NOT PARTICIPATE
                                  </h3>
                                  <p className="text-[0.7rem] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                    You did not lock in a team for <strong>{currentRoundLabel}</strong>. Past rounds cannot be modified.
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="text-center py-6 px-4 rounded-lg bg-red-950/80 border border-primary/50 space-y-4">
                              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 border border-primary text-primary animate-pulse">
                                <AlertTriangle className="h-6 w-6 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-racing font-bold text-white text-sm tracking-widest uppercase">
                                  ENGINE COLD! 🚨
                                </h3>
                                <p className="text-xs text-red-100 leading-relaxed max-w-xs mx-auto">
                                  Your car is still on the jacks. You have <strong>not locked in a team</strong> for this race weekend!
                                </p>
                              </div>
                              <Button asChild size="sm" className="font-racing tracking-[0.2em] bg-primary hover:bg-primary/90 text-white w-full">
                                <Link to="/my-team">
                                  ⚡ ENTER THE GARAGE
                                </Link>
                              </Button>
                            </div>
                          );
                        }
                        return (
                          <div className="py-4 text-center space-y-3">
                            <p className="text-xs text-muted-foreground">
                              No locked team recorded for this user.
                            </p>
                            {!isSelf && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearInspect}
                                className="font-racing text-[0.7rem] tracking-wider border-border text-foreground hover:bg-secondary w-full"
                              >
                                ⬅️ RETURN TO MY GARAGE
                              </Button>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-border/60">
                            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
                              Driver Lineup
                            </span>
                            <div className="flex items-center gap-2">
                              {!isSelf && (
                                <button
                                  type="button"
                                  onClick={handleClearInspect}
                                  className="text-[0.65rem] font-bold text-primary hover:text-primary-foreground border border-primary/30 hover:bg-primary/20 px-2 py-0.5 rounded transition-all tracking-wider uppercase"
                                >
                                  ⬅️ My Team
                                </button>
                              )}
                              <span className="text-xs font-semibold text-gradient-gold">
                                @{displayTeam.username}
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            {displayTeam.drivers.map((driverId) => {
                              const driver = getDriverDetails(driverId);
                              return (
                                <div
                                  key={driverId}
                                  className="flex items-center justify-between rounded-md bg-secondary/40 border border-border/40 p-2 hover:border-primary/30 transition-all hover:bg-secondary/60 relative overflow-hidden"
                                >
                                  <div
                                    className="absolute left-0 top-0 bottom-0 w-1"
                                    style={{ backgroundColor: driver.teamColor }}
                                  />
                                  <div className="flex items-center gap-2 pl-2">
                                    <span className="text-sm">{driver.flag}</span>
                                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      {driver.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end text-right">
                                    <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
                                      {driver.team}
                                    </span>
                                    {roundResults && (
                                      <span className="text-[0.6rem] font-bold text-gradient-gold mt-0.5 animate-pulse">
                                        {getDriverPoints(driverId)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
                                Constructors
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {displayTeam.constructors.map((cId) => {
                                if (!cId) return null;
                                const constructor = getConstructorDetails(cId);
                                return (
                                  <div
                                    key={cId}
                                    className="flex flex-col items-center justify-center rounded-md bg-secondary/40 border border-border/40 p-2.5 hover:border-primary/30 transition-all hover:bg-secondary/60 text-center"
                                  >
                                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                                      {constructor.name}
                                    </span>
                                    {roundResults && (
                                      <span className="text-[0.6rem] font-bold text-gradient-gold mt-1 animate-pulse">
                                        {getConstructorPoints(cId)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <p className="text-[0.65rem] text-muted-foreground text-center pt-2">
                            {inspectedRoundTeamData?.locked 
                              ? "Round locked — click any username in the tables to inspect their team."
                              : "Before lock — only your own team is visible."
                            }
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
