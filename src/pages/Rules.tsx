import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Rules = () => {
  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16">
        <Card className="border-border/70 bg-card/90">
          <CardHeader>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
              GAME RULES
            </p>
            <CardTitle className="font-racing text-2xl tracking-[0.15em] sm:text-3xl">
              Rules & Scoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground sm:text-base">
            <section className="space-y-2">
              <h3 className="font-racing text-sm font-semibold tracking-[0.18em] text-foreground sm:text-base">
                1. Team structure
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                <li>Each team has 5 drivers and 2 constructors.</li>
                <li>You can modify your selection freely while the round is open for editing.</li>
                <li>Your locked team for a round is what appears in the race leaderboard and is used for scoring.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-racing text-sm font-semibold tracking-[0.18em] text-foreground sm:text-base">
                2. Points per race (drivers)
              </h3>
              <p className="text-xs sm:text-sm">
                Drivers score based on their official race finishing position:
              </p>
              <div className="grid max-w-md grid-cols-2 gap-2 rounded-lg border border-border/60 bg-background/60 p-3 text-xs sm:text-sm">
                <div>
                  <p className="font-medium text-foreground">Finishing position</p>
                  <p className="text-muted-foreground">1st, 2nd, 3rd, 4th, 5th</p>
                  <p className="text-muted-foreground">6th, 7th, 8th, 9th, 10th</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">Points</p>
                  <p>25, 18, 15, 12, 10</p>
                  <p>8, 6, 4, 2, 1</p>
                </div>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                <li>Positions 11 and lower, or DNFs, score 0 points.</li>
                <li>Your race score is the sum of points from all 5 drivers in your locked team for that round.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-racing text-sm font-semibold tracking-[0.18em] text-foreground sm:text-base">
                3. Season vs race leaderboard
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                <li>
                  <span className="font-medium text-foreground">Race leaderboard</span>: shows points for a single Grand Prix round,
                  based on the locked team for that round.
                </li>
                <li>
                  <span className="font-medium text-foreground">Season leaderboard</span>: running total of your points from all closed
                  race weekends. Each round is counted once.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-racing text-sm font-semibold tracking-[0.18em] text-foreground sm:text-base">
                4. Team lock & editing window
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                <li>You can edit your team for an upcoming round until the start of qualifying (Q1) for that Grand Prix.</li>
                <li>At Q1 start, your team for that round is hard locked. It will not change, even if you edit your base team later.</li>
                <li>The next round opens for editing only after the previous race has finished (we assume race duration ≈ 2 hours from race start).</li>
                <li>The schedule page shows race and qualifying times, and the home page shows the next lock-in time.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-racing text-sm font-semibold tracking-[0.18em] text-foreground sm:text-base">
                5. Fair play
              </h3>
              <p className="text-xs sm:text-sm">
                This game is for the Delhi NCR F1 community. One account and one username per person. Any attempts to exploit bugs or
                create unfair advantages can lead to removal from the leaderboard.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rules;

