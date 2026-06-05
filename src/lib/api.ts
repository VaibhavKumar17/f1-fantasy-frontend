/**
 * Client for the F1 Fantasy backend (FastAPI).
 * Set VITE_API_URL in .env (e.g. http://localhost:8000).
 */

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) return "";
  return url.replace(/\/$/, "");
};

export type LeaderboardEntry = {
  username: string;
  points: number;
  rank: number;
};

export type Constructor = { id: string; name: string; nationality?: string };

export async function fetchConstructors(): Promise<Constructor[]> {
  const base = getBaseUrl();
  if (!base) return [];
  const res = await fetch(`${base}/constructors`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.constructors ?? [];
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const base = getBaseUrl();
  if (!base) return [];
  const res = await fetch(`${base}/leaderboard`);
  if (!res.ok) throw new Error("Failed to load leaderboard");
  return res.json();
}

export async function fetchSeasonLeaderboard(type: string = "combined"): Promise<LeaderboardEntry[]> {
  const base = getBaseUrl();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/leaderboard/season?type=${encodeURIComponent(type)}`);

    // Fallback for backends that only expose /leaderboard
    if (res.status === 404) {
      return fetchLeaderboard();
    }

    if (!res.ok) {
      throw new Error("Failed to load season leaderboard");
    }

    return res.json();
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error(
        "Failed to fetch season leaderboard. Check that the backend is running and VITE_API_URL is correct.",
      );
    }
    throw err instanceof Error ? err : new Error("Failed to load season leaderboard");
  }
}

export async function fetchRaceLeaderboard(roundId: string, type: string = "combined"): Promise<LeaderboardEntry[]> {
  const base = getBaseUrl();
  if (!base) return [];
  const res = await fetch(`${base}/leaderboard/race/${encodeURIComponent(roundId)}?type=${encodeURIComponent(type)}`);
  if (!res.ok) throw new Error("Failed to load race leaderboard");
  return res.json();
}

export type LeaderboardHistoryEntry = { round: string; race_name: string };

export async function fetchLeaderboardHistory(): Promise<LeaderboardHistoryEntry[]> {
  const base = getBaseUrl();
  if (!base) return [];
  const res = await fetch(`${base}/leaderboard/history`);
  if (!res.ok) return [];
  return res.json();
}

export type RoundTeam = {
  username: string;
  race_round: string;
  drivers: string[];
  constructors: (string | null)[];
};

export type RoundTeamsResponse = {
  round: string;
  locked: boolean;
  teams: RoundTeam[];
};

export async function fetchRoundTeams(roundId: string, username?: string): Promise<RoundTeamsResponse> {
  const base = getBaseUrl();
  if (!base) return { round: roundId, locked: false, teams: [] };
  const params = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${base}/round-teams/${encodeURIComponent(roundId)}${params}`);
  if (!res.ok) {
    return { round: roundId, locked: false, teams: [] };
  }
  return res.json();
}

export type CreateTeamBody = {
  username: string;
  drivers: string[];
};

export type CreateTeamResponse =
  | { message: string }
  | { error: string };

const REQUEST_TIMEOUT_MS = 15_000;

export async function createTeam(
  username: string,
  driverIds: string[],
  constructorIds: string[],
  raceRound?: string
): Promise<CreateTeamResponse> {
  const base = getBaseUrl();
  if (!base) throw new Error("Backend URL not configured (VITE_API_URL)");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${base}/create-team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        drivers: driverIds,
        constructors: constructorIds,
        race_round: raceRound ?? undefined,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Request timed out. Backend may be slow or stuck — try again."
        : err instanceof TypeError && err.message === "Failed to fetch"
          ? "Could not reach the backend. Is it running? Check VITE_API_URL (e.g. http://localhost:8000)."
          : err instanceof Error ? err.message : "Network error";
    throw new Error(message);
  }
  clearTimeout(timeoutId);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error ??
      (typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail) ? data.detail[0]?.msg : data?.detail?.[0]?.msg) ??
      "Failed to save team";
    throw new Error(msg);
  }
  return data as CreateTeamResponse;
}

export function isApiConfigured(): boolean {
  return Boolean(getBaseUrl());
}
