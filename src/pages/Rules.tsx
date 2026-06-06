import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, Calendar, Lightbulb, Zap } from "lucide-react";

const Rules = () => {
  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24">
      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16 max-w-4xl">
        <header className="mb-8 text-center sm:text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary animate-pulse">
            🏁 THE RULEBOOK
          </p>
          <h1 className="font-racing text-3xl font-bold tracking-[0.2em] text-gradient-red sm:text-4xl">
            RULES & SCORING
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Lights out and away we go! Here is how to dominate the F1 Delhi NCR community fantasy league.
          </p>
        </header>

        <div className="grid gap-6">
          {/* 1. Team Structure */}
          <Card className="border border-border/80 bg-background/70 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-primary/40">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-orange-500" />
            <CardHeader className="pb-3 flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <Badge className="mb-1 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-[0.6rem] font-bold uppercase tracking-wider">
                  Rule 01
                </Badge>
                <CardTitle className="font-racing text-sm sm:text-base tracking-wider text-foreground">
                  Garage Lineup (Team Structure)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-2 pl-14">
              <ul className="list-disc space-y-1.5 pl-4">
                <li>Each team is armed with <strong className="text-foreground">5 drivers</strong> and <strong className="text-foreground">2 constructors</strong>.</li>
                <li>Budget cap limits apply (₹100M for drivers, ₹100M for constructors). Choose wisely!</li>
                <li>Modify your lineup freely while the editing window is open. Sandbag all you want before the lock!</li>
                <li>The team you lock in for the round is what rival managers will inspect once the weekend starts.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 2. Driver Points */}
          <Card className="border border-border/80 bg-background/70 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-accent/40">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-accent to-yellow-500" />
            <CardHeader className="pb-3 flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <Badge className="mb-1 bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 text-[0.6rem] font-bold uppercase tracking-wider">
                  Rule 02
                </Badge>
                <CardTitle className="font-racing text-sm sm:text-base tracking-wider text-foreground">
                  Driver points (Weekly Masterclass)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-3 pl-14">
              <p>
                Drivers score points based on their official race finishing position. Let's see who gets the bragging rights:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mt-2">
                <div className="rounded-lg border border-border/60 bg-black/40 p-3 space-y-2">
                  <p className="font-racing text-[0.65rem] font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
                    🏆 Podium & Top Finishers
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 text-[0.7rem] sm:text-xs">
                    <span className="font-semibold text-gradient-gold">P1 (25 pts)</span>
                    <span className="text-right text-foreground">Hammertime! 🏆</span>
                    
                    <span className="font-semibold text-gradient-gold">P2 (18 pts)</span>
                    <span className="text-right text-foreground">Rico Suave Podium 🍾</span>
                    
                    <span className="font-semibold text-gradient-gold">P3 (15 pts)</span>
                    <span className="text-right text-foreground">Champagne Shower 🥂</span>
                    
                    <span className="font-semibold text-foreground">P4 (12 pts)</span>
                    <span className="text-right text-muted-foreground">Mega Drive! ⚡</span>
                    
                    <span className="font-semibold text-foreground">P5 (10 pts)</span>
                    <span className="text-right text-muted-foreground">Solid Points 🏎️</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-black/40 p-3 space-y-2">
                  <p className="font-racing text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                    🏁 In The Points & DNFs
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 text-[0.7rem] sm:text-xs">
                    <span className="font-semibold text-foreground">P6 (8 pts)</span>
                    <span className="text-right text-muted-foreground">Chasing the Pack 🏁</span>
                    
                    <span className="font-semibold text-foreground">P7 (6 pts)</span>
                    <span className="text-right text-muted-foreground">Keep Pushing 🔋</span>
                    
                    <span className="font-semibold text-foreground">P8 (4 pts)</span>
                    <span className="text-right text-muted-foreground">Sneaked In 🎟️</span>
                    
                    <span className="font-semibold text-foreground">P9 (2 pts)</span>
                    <span className="text-right text-muted-foreground">Every Point Counts 🔢</span>
                    
                    <span className="font-semibold text-foreground">P10 (1 pt)</span>
                    <span className="text-right text-muted-foreground">Squeezed 1 point 🤏</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-3 text-red-200 border-l-4 border-l-red-500 mt-2 flex items-start gap-2 max-w-2xl">
                <span className="text-lg">💀</span>
                <div>
                  <p className="font-semibold text-[0.7rem] sm:text-xs uppercase tracking-wider">P11 & Lower or DNF (0 pts)</p>
                  <p className="text-[0.65rem] sm:text-[0.7rem] text-red-200/70">
                    "Bono, my tyres are gone!" Or engine blowout, or hit the wall. You get absolutely <strong className="text-white">0 points</strong>. Avoid these like the plague!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Constructor Points (New!) */}
          <Card className="border border-border/80 bg-background/70 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-emerald-400/40">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-500" />
            <CardHeader className="pb-3 flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <Badge className="mb-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[0.6rem] font-bold uppercase tracking-wider">
                  Rule 03
                </Badge>
                <CardTitle className="font-racing text-sm sm:text-base tracking-wider text-foreground">
                  Constructor Scoring (Double Trouble!)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-2 pl-14">
              <p>
                Constructors earn the <strong className="text-foreground">sum of the points scored by both of their drivers</strong> during the race:
              </p>
              <ul className="list-disc space-y-1.5 pl-4">
                <li>If your selected constructor has drivers finish <strong className="text-foreground">P1 (25 pts)</strong> and <strong className="text-foreground">P2 (18 pts)</strong>, your constructor scores a massive <strong className="text-gradient-gold">43 points</strong>!</li>
                <li>If one driver DNFs (0 pts) but the other wins P1 (25 pts), the constructor still gets 25 points.</li>
                <li>Stacking drivers and their matching constructor can yield insane multipliers—or catastrophic failures. Calculate the risk!</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Season vs Race */}
          <Card className="border border-border/80 bg-background/70 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-purple-400/40">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-indigo-500" />
            <CardHeader className="pb-3 flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <Badge className="mb-1 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-[0.6rem] font-bold uppercase tracking-wider">
                  Rule 04
                </Badge>
                <CardTitle className="font-racing text-sm sm:text-base tracking-wider text-foreground">
                  Season Standings vs Race Standings
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-2 pl-14">
              <ul className="list-disc space-y-1.5 pl-4">
                <li><strong className="text-foreground">Race standings</strong>: shows points for a single Grand Prix round, based on the team you locked in for that round.</li>
                <li><strong className="text-foreground">Season standings</strong>: running total of your points from all closed race weekends.</li>
                <li>New managers or managers who miss a race get <strong className="text-foreground">0 points</strong> for that round. No retro-scoring or free handouts! It is a fair fight.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Locks */}
          <Card className="border border-border/80 bg-background/70 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-red-400/40">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-pink-500" />
            <CardHeader className="pb-3 flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <Badge className="mb-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[0.6rem] font-bold uppercase tracking-wider">
                  Rule 05
                </Badge>
                <CardTitle className="font-racing text-sm sm:text-base tracking-wider text-foreground">
                  Locking Window (Box Box!)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-2 pl-14">
              <ul className="list-disc space-y-1.5 pl-4">
                <li>You can edit your team for an upcoming round until <strong className="text-foreground">Qualifying (Q1) starts</strong>.</li>
                <li>At Q1 start, the gate drops! Your lineup is hard locked for that round.</li>
                <li>The market opens again (unlocked) approximately <strong className="text-foreground">2 hours after the race start</strong>. Keep an eye on the clock!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rules;
