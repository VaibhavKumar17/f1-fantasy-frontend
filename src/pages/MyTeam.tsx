import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Check, AlertTriangle, LogIn, Trophy, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CountdownClock } from "@/components/CountdownClock";
import { fetchDrivers, type Driver } from "@/data/drivers";
import { getConstructors, CONSTRUCTOR_BUDGET, type Constructor } from "@/data/constructors";
import { fetchSchedule, getNextLockCloseUtc, getLockInRaceRound } from "@/data/schedule";
import { useAuth } from "@/contexts/AuthContext";
import { createTeam, isApiConfigured } from "@/lib/api";
import { toast } from "sonner";

const BUDGET_CAP = 100;
const MAX_DRIVERS = 5;
const MAX_CONSTRUCTORS = 2;

const constructorsList = getConstructors();

const MyTeam = () => {
  const { user, username } = useAuth();
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [selectedConstructors, setSelectedConstructors] = useState<Constructor[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [saving, setSaving] = useState(false);
  const [hasLockedOnce, setHasLockedOnce] = useState(false);
  const [editing, setEditing] = useState(true);

  const { data: drivers = [], isLoading } = useQuery<Driver[]>({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  });

  const [now, setNow] = useState(() => new Date());
  const hasRestoredDrivers = useRef(false);
  const hasRestoredConstructors = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Restore from localStorage only once on first load so clearing the team doesn’t re-fill from storage
  useEffect(() => {
    if (hasRestoredDrivers.current || selectedDrivers.length > 0) return;
    hasRestoredDrivers.current = true;
    try {
      const raw = localStorage.getItem("f1-fantasy-team");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Driver[];
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      setSelectedDrivers(parsed);
      if (parsed.length === MAX_DRIVERS) {
        setHasLockedOnce(true);
        setEditing(false);
      }
    } catch {
      // ignore
    }
  }, [selectedDrivers.length]);

  useEffect(() => {
    if (hasRestoredConstructors.current || selectedConstructors.length > 0) return;
    hasRestoredConstructors.current = true;
    try {
      const raw = localStorage.getItem("f1-fantasy-constructors");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { id: string; name: string }[];
      if (!Array.isArray(parsed) || parsed.length > MAX_CONSTRUCTORS) return;
      const ids = new Set(constructorsList.map((c) => c.id));
      const valid = parsed.filter((p) => p.id && ids.has(p.id));
      if (valid.length === parsed.length) {
        const next = valid.map((p) => constructorsList.find((c) => c.id === p.id)!).filter(Boolean);
        if (next.length === valid.length) setSelectedConstructors(next);
      }
    } catch {
      // ignore
    }
  }, [selectedConstructors.length]);
  const { data: scheduleData } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
  });
  const nextLockClose = useMemo(
    () => (scheduleData?.races ? getNextLockCloseUtc(scheduleData.races) : null),
    [scheduleData]
  );
  const lockClosed = nextLockClose !== null && now >= nextLockClose;

  const TEAM_ORDER = [
    "McLaren",
    "Mercedes",
    "Red Bull Racing",
    "Ferrari",
    "Williams",
    "Racing Bulls",
    "Aston Martin",
    "Haas",
    "Audi",
    "Alpine",
    "Cadillac",
  ];

  const teams = useMemo(
    () => ["All", ...TEAM_ORDER.filter((t) => drivers.some((d) => d.team === t))],
    [drivers],
  );
  const budgetUsed = selectedDrivers.reduce((sum, d) => sum + d.price, 0);
  const budgetLeft = BUDGET_CAP - budgetUsed;
  const constructorBudgetUsed = selectedConstructors.reduce((sum, c) => sum + c.price, 0);
  const constructorBudgetLeft = CONSTRUCTOR_BUDGET - constructorBudgetUsed;

  const filteredDrivers =
    filter === "All" ? drivers : drivers.filter((d) => d.team === filter);

  if (isLoading && drivers.length === 0) {
    return (
      <div className="min-h-screen bg-carbon pt-24">
        <div className="container mx-auto px-4 pb-16">
          <p className="text-sm text-muted-foreground">
            Loading the latest F1 drivers from the 2026 feed…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-carbon pt-24">
        <div className="container mx-auto px-4 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <Card className="overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 shadow-xl shadow-primary/10">
              <div className="relative p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                  <Trophy className="h-8 w-8" />
                </div>
                <h2 className="mb-2 font-racing text-2xl font-bold tracking-[0.2em] text-gradient-red sm:text-3xl">
                  SIGN IN TO BUILD YOUR TEAM
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Create an account or sign in to pick your 5 drivers, lock in your team, and climb the leaderboard. Your team is saved to your profile.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="font-racing tracking-[0.2em] bg-primary hover:bg-primary/90">
                    <Link to="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      LOG IN
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="font-racing tracking-[0.2em]">
                    <Link to="/signup">SIGN UP</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const toggleDriver = (driver: Driver) => {
    if (lockClosed || !editing) return;
    if (selectedDrivers.find((d) => d.id === driver.id)) {
      setSelectedDrivers((prev) => prev.filter((d) => d.id !== driver.id));
      return;
    }
    if (selectedDrivers.length >= MAX_DRIVERS) {
      toast.error("Maximum 5 drivers allowed!");
      return;
    }
    if (driver.price > budgetLeft) {
      toast.error("Not enough budget!");
      return;
    }
    setSelectedDrivers((prev) => [...prev, driver]);
    toast.success(`${driver.name} added to your team!`);
  };

  const isSelected = (id: string) => selectedDrivers.some((d) => d.id === id);
  const isConstructorSelected = (id: string) => selectedConstructors.some((c) => c.id === id);

  const toggleConstructor = (c: Constructor) => {
    if (lockClosed || !editing) return;
    if (selectedConstructors.some((x) => x.id === c.id)) {
      setSelectedConstructors((prev) => prev.filter((x) => x.id !== c.id));
      return;
    }
    if (selectedConstructors.length >= MAX_CONSTRUCTORS) {
      toast.error("Maximum 2 constructors allowed.");
      return;
    }
    if (c.price > constructorBudgetLeft) {
      toast.error("Constructor budget exceeded.");
      return;
    }
    setSelectedConstructors((prev) => [...prev, c]);
  };

  const saveTeam = async () => {
    if (selectedDrivers.length < MAX_DRIVERS) {
      toast.error("Please select 5 drivers");
      return;
    }
    if (selectedConstructors.length < MAX_CONSTRUCTORS) {
      toast.error("Please select 2 constructors");
      return;
    }
    if (constructorBudgetUsed > CONSTRUCTOR_BUDGET) {
      toast.error("Constructor budget exceeded.");
      return;
    }
    if (!username) {
      toast.error("Set your username in Profile first (one username per person).");
      return;
    }
    const driverIds = selectedDrivers.map((d) => d.id);
    const constructorIds = selectedConstructors.map((c) => c.id);
    const raceRound = scheduleData?.races ? getLockInRaceRound(scheduleData.races) : undefined;
    localStorage.setItem("f1-fantasy-team", JSON.stringify(selectedDrivers));
    localStorage.setItem("f1-fantasy-constructors", JSON.stringify(selectedConstructors));
    if (isApiConfigured()) {
      setSaving(true);
      try {
        await createTeam(username, driverIds, constructorIds, raceRound ?? undefined);
        toast.success("Team locked in! You're on the leaderboard.");
        setHasLockedOnce(true);
        setEditing(false);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to save team";
        const isBackendUnreachable =
          message.includes("Could not reach the backend") || message.includes("Network error");
        const isTimeout = message.includes("timed out") || message.includes("slow or stuck");
        if (isBackendUnreachable) {
          toast.warning(
            "Backend not running. Team saved locally — start the backend to appear on the leaderboard."
          );
        } else if (isTimeout) {
          toast.warning(
            "Request timed out. Team saved locally — check the backend and try again."
          );
        } else {
          toast.error(message);
        }
      } finally {
        setSaving(false);
      }
    } else {
      toast.success("Team saved locally. Set VITE_API_URL and start the backend to appear on the leaderboard.");
    }
  };

  return (
    <div className="min-h-screen bg-carbon pt-24">
      <div className="container mx-auto px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 font-racing text-3xl font-bold tracking-[0.2em] text-gradient-red sm:text-4xl">
            BUILD YOUR TEAM
          </h1>
          <p className="mb-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            First pick {MAX_DRIVERS} drivers (₹{BUDGET_CAP}M cap), then pick {MAX_CONSTRUCTORS} constructors (₹{CONSTRUCTOR_BUDGET}M cap). Lock in to save.
          </p>
          {nextLockClose && (
            <div className="mb-6 inline-block">
              <CountdownClock
                targetUtc={nextLockClose}
                label={lockClosed ? "Next lock-in closes (Q1)" : "Time left to edit team (Q1)"}
              />
            </div>
          )}
          {lockClosed && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Team locked for this weekend. You can edit again before the next Grand Prix qualifying (Q1).</span>
            </div>
          )}
          {!lockClosed && hasLockedOnce && !editing && (
            <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
              <span>Your team is locked in for the next race. You can still modify it until Q1 starts.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="border-emerald-400 text-emerald-100 hover:bg-emerald-500/20"
              >
                Modify team
              </Button>
            </div>
          )}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Drivers first */}
          <div className="lg:col-span-2 space-y-6">
            {hasLockedOnce && !editing ? (
              <Card className="border-border/70 bg-card/90 overflow-hidden">
                <div className="border-b border-border bg-secondary/50 p-4">
                  <h2 className="font-racing text-sm font-bold tracking-wider text-foreground">
                    YOUR LOCKED TEAM
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This is your current team for the selected race. You can still modify it until Q1 starts.
                  </p>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      Drivers
                    </p>
                    {selectedDrivers.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No drivers selected yet.</p>
                    ) : (
                      <ul className="space-y-1.5 text-sm">
                        {selectedDrivers.map((d) => (
                          <li key={d.id} className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span>{d.flag}</span>
                              <span>{d.name}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">₹{d.price}M</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      Constructors
                    </p>
                    {selectedConstructors.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No constructors selected yet.</p>
                    ) : (
                      <ul className="space-y-1.5 text-sm">
                        {selectedConstructors.map((c) => (
                          <li key={c.id} className="flex items-center justify-between">
                            <span>{c.name}</span>
                            <span className="text-xs text-muted-foreground">₹{c.price}M</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {!lockClosed && (
                  <div className="border-t border-border bg-secondary/40 p-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="font-racing text-xs tracking-[0.2em]"
                    >
                      MODIFY TEAM
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <>
                {/* Team filter + driver grid */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <button
                      key={team}
                      onClick={() => setFilter(team)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        filter === team
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredDrivers.map((driver) => {
                    const selected = isSelected(driver.id);
                    const tooExpensive = !selected && driver.price > budgetLeft;
                    const teamFull = !selected && selectedDrivers.length >= MAX_DRIVERS;

                    return (
                      <motion.div
                        key={driver.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          onClick={() => editing && !lockClosed && !tooExpensive && !teamFull && toggleDriver(driver)}
                          className={`relative overflow-hidden p-4 transition-all ${
                            lockClosed || !editing ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                          } ${
                            selected
                              ? "border-primary/50 bg-primary/5 glow-red"
                              : tooExpensive || teamFull
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:border-border"
                          }`}
                        >
                          {/* Team color accent */}
                          <div
                            className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                            style={{ backgroundColor: driver.teamColor }}
                          />

                          <div className="flex items-center gap-3 pl-3">
                            <Avatar className="h-10 w-10 bg-secondary">
                              {driver.photoUrl && (
                                <AvatarImage src={driver.photoUrl} alt={driver.name} />
                              )}
                              <AvatarFallback className="font-racing text-lg font-bold text-foreground">
                                {driver.number || driver.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                <span className="mr-1">{driver.flag}</span>
                                {driver.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{driver.team}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-racing text-sm font-bold text-accent">
                                ₹{driver.price}M
                              </p>
                            </div>
                            {selected && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                <Check className="h-3.5 w-3.5 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Constructors – after drivers */}
                <Card className="border-border/70 bg-card/90 overflow-hidden">
                  <div className="border-b border-border bg-secondary/50 p-3">
                    <h2 className="font-racing text-xs font-bold tracking-wider text-foreground">
                      PICK 2 CONSTRUCTORS
                    </h2>
                    <p className="text-[0.65rem] text-muted-foreground mt-0.5">
                      Choose 2 teams within ₹{CONSTRUCTOR_BUDGET}M. Prices from 2025 constructor championship order.
                    </p>
                  </div>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {constructorsList.map((c) => {
                        const selected = isConstructorSelected(c.id);
                        const overBudget = !selected && c.price > constructorBudgetLeft;
                        const full = !selected && selectedConstructors.length >= MAX_CONSTRUCTORS;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => editing && !overBudget && !full && toggleConstructor(c)}
                            disabled={lockClosed || !editing || overBudget || full}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                              selected
                                ? "border-primary bg-primary/15 text-primary"
                                : "border-border bg-background/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            } ${overBudget || full ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {selected && <Check className="inline h-3 w-3 mr-1" />}
                            {c.name}
                            <span className="ml-1.5 text-[0.65rem] opacity-80">₹{c.price}M</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-[0.65rem] text-muted-foreground">
                      {selectedConstructors.length}/{MAX_CONSTRUCTORS} selected · ₹{constructorBudgetUsed}M / ₹{CONSTRUCTOR_BUDGET}M
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Team Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="overflow-hidden">
                <div className="border-b border-border bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-racing text-sm font-bold tracking-wider text-foreground">
                      YOUR TEAM
                    </h2>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {selectedDrivers.length}/{MAX_DRIVERS}
                    </span>
                  </div>
                </div>

                {/* Budget bar */}
                <div className="border-b border-border p-4">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Budget Used</span>
                    <span className="font-racing font-bold text-foreground">
                      ₹{budgetUsed}M / ₹{BUDGET_CAP}M
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(budgetUsed / BUDGET_CAP) * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">
                    ₹{budgetLeft}M remaining
                  </p>
                </div>

                {/* Constructor budget + selected */}
                <div className="border-b border-border p-4">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Constructors</span>
                    <span className="font-racing font-bold text-foreground">
                      ₹{constructorBudgetUsed}M / ₹{CONSTRUCTOR_BUDGET}M
                    </span>
                  </div>
                  {selectedConstructors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedConstructors.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-foreground"
                        >
                          {c.name} <span className="opacity-70">₹{c.price}M</span>
                          {!lockClosed && editing && (
                            <button
                              type="button"
                              onClick={() => setSelectedConstructors((p) => p.filter((x) => x.id !== c.id))}
                              className="rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedConstructors.length < MAX_CONSTRUCTORS && (
                    <p className="mt-1 text-[0.65rem] text-muted-foreground">
                      {MAX_CONSTRUCTORS - selectedConstructors.length} constructor{MAX_CONSTRUCTORS - selectedConstructors.length > 1 ? "s" : ""} to pick
                    </p>
                  )}
                </div>

                {/* Selected drivers */}
                <div className="p-4">
                  <AnimatePresence mode="popLayout">
                    {selectedDrivers.map((driver) => (
                      <motion.div
                        key={driver.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="mb-2 flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-1 rounded-full"
                            style={{ backgroundColor: driver.teamColor }}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {driver.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            ₹{driver.price}M
                          </span>
                          {!lockClosed && editing && (
                            <button
                              onClick={() => toggleDriver(driver)}
                              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Empty slots */}
                  {Array.from({ length: MAX_DRIVERS - selectedDrivers.length }).map(
                    (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="mb-2 flex items-center justify-center rounded-lg border border-dashed border-border p-3"
                      >
                        <span className="text-xs text-muted-foreground">Empty slot</span>
                      </div>
                    )
                  )}
                </div>

                {/* Save button */}
                <div className="p-4 pt-0">
                  {(selectedDrivers.length < MAX_DRIVERS || selectedConstructors.length < MAX_CONSTRUCTORS) && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg bg-accent/10 p-2">
                      <AlertTriangle className="h-4 w-4 text-accent" />
                      <span className="text-xs text-accent">
                        {selectedDrivers.length < MAX_DRIVERS
                          ? `Select ${MAX_DRIVERS - selectedDrivers.length} more driver${MAX_DRIVERS - selectedDrivers.length > 1 ? "s" : ""}`
                          : `Select ${MAX_CONSTRUCTORS - selectedConstructors.length} more constructor${MAX_CONSTRUCTORS - selectedConstructors.length > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={saveTeam}
                    disabled={
                      lockClosed ||
                      selectedDrivers.length < MAX_DRIVERS ||
                      selectedConstructors.length < MAX_CONSTRUCTORS ||
                      constructorBudgetUsed > CONSTRUCTOR_BUDGET ||
                      saving
                    }
                    className="w-full font-racing text-sm tracking-wider"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {lockClosed
                      ? "LOCKED (Q1 STARTED)"
                      : saving
                        ? "SAVING…"
                        : hasLockedOnce
                          ? "UPDATE LOCKED TEAM"
                          : "LOCK IN TEAM"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
