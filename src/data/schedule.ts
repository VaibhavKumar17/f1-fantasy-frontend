export type Race = {
  round: string;
  name: string;
  circuit: string;
  location: string;
  /** Localised race date (e.g. 02 Mar) */
  date: string;
  /** Localised race start time in IST (HH:mm) */
  localTime: string;
  /** UTC start datetime in ISO format for comparisons */
  dateTimeUtc: string;
  /** Q1 / qualifying start – team lock closes at this time (UTC ISO) */
  qualifyingDateUtc: string;
  /** Localised qualifying date (IST) */
  qualifyingDate?: string;
  /** Localised qualifying time (IST HH:mm) */
  qualifyingLocalTime?: string;
  /** Whether this weekend has a sprint race */
  hasSprint: boolean;
  /** Localised sprint date (IST) if applicable */
  sprintDate?: string;
  /** Localised sprint start time in IST (HH:mm) if applicable */
  sprintLocalTime?: string;
};

export type SeasonSchedule = {
  season: string;
  races: Race[];
};

export async function fetchSchedule(): Promise<SeasonSchedule> {
  const response = await fetch("https://api.jolpi.ca/ergast/f1/current.json");

  if (!response.ok) {
    throw new Error("Failed to load F1 schedule");
  }

  const json = await response.json();
  const raceTable = json?.MRData?.RaceTable;
  const season: string = raceTable?.season ?? "";
  const racesRaw = raceTable?.Races ?? [];

  const races: Race[] = racesRaw.map((race: any) => {
    const dateStr: string | undefined = race.date;
    const timeStr: string | undefined = race.time; // UTC time from Ergast, e.g. 14:00:00Z

    let utcIso = "";
    if (dateStr && timeStr) {
      utcIso = `${dateStr}T${timeStr.replace("Z", "")}Z`;
    } else if (dateStr) {
      utcIso = `${dateStr}T00:00:00Z`;
    }

    const utcDate = utcIso ? new Date(utcIso) : null;

    const sprintDateStr: string | undefined = race.Sprint?.date;
    const sprintTimeStr: string | undefined = race.Sprint?.time;

    let sprintUtcIso = "";
    if (sprintDateStr && sprintTimeStr) {
      sprintUtcIso = `${sprintDateStr}T${sprintTimeStr.replace("Z", "")}Z`;
    }

    const sprintUtcDate = sprintUtcIso ? new Date(sprintUtcIso) : null;

    const qualDateStr: string | undefined = race.Qualifying?.date;
    const qualTimeStr: string | undefined = race.Qualifying?.time;
    let qualifyingUtcIso = "";
    if (qualDateStr && qualTimeStr) {
      qualifyingUtcIso = `${qualDateStr}T${qualTimeStr.replace("Z", "")}Z`;
    } else if (qualDateStr) {
      qualifyingUtcIso = `${qualDateStr}T00:00:00Z`;
    }
    const qualifyingUtcDate = qualifyingUtcIso ? new Date(qualifyingUtcIso) : null;
    const qualifyingLocalDate = qualifyingUtcDate
      ? qualifyingUtcDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          timeZone: "Asia/Kolkata",
        })
      : undefined;
    const qualifyingLocalTime = qualifyingUtcDate
      ? qualifyingUtcDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      : undefined;

    const localDate = utcDate
      ? utcDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          timeZone: "Asia/Kolkata",
        })
      : dateStr ?? "";

    const localTime = utcDate
      ? utcDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      : "";

    const sprintLocalDate = sprintUtcDate
      ? sprintUtcDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          timeZone: "Asia/Kolkata",
        })
      : undefined;

    const sprintLocalTime = sprintUtcDate
      ? sprintUtcDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      : undefined;

    const locality = race.Circuit?.Location?.locality ?? "";
    const country = race.Circuit?.Location?.country ?? "";
    const location =
      locality && country ? `${locality}, ${country}` : locality || country || "";

    return {
      round: race.round,
      name: race.raceName,
      circuit: race.Circuit?.circuitName ?? "",
      location,
      date: localDate,
      localTime,
      dateTimeUtc: utcIso,
      qualifyingDateUtc: qualifyingUtcIso,
      qualifyingDate: qualifyingLocalDate,
      qualifyingLocalTime,
      hasSprint: Boolean(race.Sprint),
      sprintDate: sprintLocalDate,
      sprintLocalTime,
    };
  });

  return { season, races };
}

/** Next qualifying (Q1) start in UTC – team lock closes at this moment. Pass `now` for reactive updates. */
export function getNextLockCloseUtc(races: Race[], now: Date = new Date()): Date | null {
  for (const r of races) {
    if (!r.qualifyingDateUtc) continue;
    const q = new Date(r.qualifyingDateUtc);
    if (q > now) return q;
  }
  return null;
}

/** Next race weekend (first race whose Q1 is still in the future). Pass `now` for reactive updates. */
export function getNextRace(races: Race[], now: Date = new Date()): Race | null {
  for (const r of races) {
    if (!r.qualifyingDateUtc) continue;
    const q = new Date(r.qualifyingDateUtc);
    if (q > now) return r;
  }
  return null;
}

/** Round number (e.g. "1") for the race we're currently locking in for (next upcoming Q1) */
export function getCurrentRaceRound(races: Race[]): string | null {
  const now = new Date();
  for (const r of races) {
    if (!r.qualifyingDateUtc) continue;
    const q = new Date(r.qualifyingDateUtc);
    if (q > now) return r.round;
  }
  return null;
}

/** Round to send when locking in: next Q1 round, or last race round if all qualis past, or first round. Ensures a round is always sent so backend creates TeamPick. */
export function getLockInRaceRound(races: Race[]): string | undefined {
  const next = getCurrentRaceRound(races);
  if (next) return next;
  if (races.length === 0) return undefined;
  return races[races.length - 1].round ?? races[0].round;
}

/** Next race weekend unlock (next qualifying open for editing) – first qualifying in the future */
export function getNextUnlockUtc(races: Race[], now: Date = new Date()): Date | null {
  return getNextLockCloseUtc(races, now);
}
