import { Flag, Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedule, type SeasonSchedule } from "@/data/schedule";

const Schedule = () => {
  const {
    data,
    isLoading,
    isError,
  } = useQuery<SeasonSchedule>({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
  });

  const races = data?.races ?? [];
  const season = data?.season ?? "";

  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16">
        <header className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
            {season ? `SEASON ${season}` : "CURRENT SEASON"}
          </p>
          <h1 className="font-racing text-3xl font-bold tracking-[0.2em] text-gradient-red sm:text-4xl">
            RACE SCHEDULE
          </h1>
        </header>

        <Card className="border-border/60 bg-background/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Flag className="h-4 w-4 text-accent" />
              Upcoming rounds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading the official {season || "current"} F1 race calendar…
              </p>
            )}

            {isError && !isLoading && (
              <p className="text-sm text-destructive">
                We couldn&apos;t load the race schedule from the F1 API. Please check your
                connection and try again.
              </p>
            )}

            {!isLoading &&
              !isError &&
              races.map((race) => (
                <div
                  key={race.round}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-racing text-xs font-bold text-foreground">
                      R{race.round}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{race.name}</p>
                      <p className="text-xs text-muted-foreground">{race.circuit}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground sm:justify-end">
                    <div className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        Race: {race.date}
                        {race.localTime ? ` • ${race.localTime} IST` : ""}
                      </span>
                    </div>
                    {race.qualifyingDate && race.qualifyingLocalTime && (
                      <div className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Quali (team lock): {race.qualifyingDate} • {race.qualifyingLocalTime} IST
                        </span>
                      </div>
                    )}
                    {race.hasSprint && race.sprintDate && race.sprintLocalTime && (
                      <div className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Sprint: {race.sprintDate} • {race.sprintLocalTime} IST
                        </span>
                      </div>
                    )}
                    {race.location && (
                      <div className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{race.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {!isLoading && !isError && races.length > 0 && (
              <p className="pt-1 text-xs text-muted-foreground">
                Data powered by the Ergast F1 API for the {season} world championship.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
