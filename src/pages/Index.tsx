import { useState, useEffect, useMemo, useRef } from "react";
import { Users, ArrowRight, Play, Trophy, Activity, Flag, Zap, HelpCircle, Check, X, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedule, getNextRace, getNextLockCloseUtc } from "@/data/schedule";
import F1VideoPlayer from "@/components/F1VideoPlayer";

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

// Starting lights component for F1 feel
const F1StartingLights = () => {
  const [litCount, setLitCount] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const [sequenceKey, setSequenceKey] = useState(0); // For restarting the sequence

  useEffect(() => {
    setLitCount(0);
    setLightsOut(false);
    
    // Light up one pair of red lights every 800ms
    const lightTimers = [1, 2, 3, 4, 5].map((num) => {
      return setTimeout(() => {
        setLitCount(num);
      }, num * 800);
    });

    // Turn all lights out after 5.2 seconds (all lit at 4s, stay for 1.2s)
    const outTimer = setTimeout(() => {
      setLightsOut(true);
    }, 5200);

    return () => {
      lightTimers.forEach(clearTimeout);
      clearTimeout(outTimer);
    };
  }, [sequenceKey]);

  return (
    <div className="flex flex-col items-center justify-center py-4 bg-black/60 border border-neutral-800 rounded-xl px-6 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-red-900/5 pointer-events-none" />
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2.5 flex items-center gap-1.5">
        <Activity className="h-3.5 w-3.5 text-red-500 animate-pulse" />
        STARTING GRID SEQUENCE
      </span>
      
      {/* Lights Gantry Structure */}
      <div className="bg-neutral-900 border-2 border-neutral-700 p-2.5 rounded-lg flex gap-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative z-10">
        {[1, 2, 3, 4, 5].map((index) => {
          const isLit = litCount >= index && !lightsOut;
          return (
            <div key={index} className="flex flex-col gap-1.5 items-center bg-black/80 p-1 rounded-md border border-neutral-800">
              {/* Red Light */}
              <div 
                className={`w-6 h-6 rounded-full transition-all duration-150 ${
                  isLit 
                    ? "bg-red-600 shadow-[0_0_25px_#ef4444,0_0_10px_#ef4444] scale-105" 
                    : "bg-neutral-950 border border-neutral-900"
                }`} 
              />
              {/* Red Light duplication for typical double-stacked gantry */}
              <div 
                className={`w-6 h-6 rounded-full transition-all duration-150 ${
                  isLit 
                    ? "bg-red-600 shadow-[0_0_25px_#ef4444,0_0_10px_#ef4444] scale-105" 
                    : "bg-neutral-950 border border-neutral-900"
                }`} 
              />
            </div>
          );
        })}
      </div>

      {/* Race Status Text */}
      <div className="mt-3.5 h-6 flex items-center justify-center font-racing">
        <AnimatePresence mode="wait">
          {lightsOut ? (
            <motion.span 
              key="away"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-black italic tracking-wider text-emerald-400 glow-green"
            >
              LIGHTS OUT AND AWAY WE GO! 🏁
            </motion.span>
          ) : litCount === 5 ? (
            <motion.span 
              key="wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-bold uppercase tracking-widest text-yellow-500 animate-pulse"
            >
              HOLD ON GRID...
            </motion.span>
          ) : (
            <motion.span 
              key="prep"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[0.7rem] uppercase tracking-widest text-neutral-400 font-mono"
            >
              PREPARING RACE GANTRY ({litCount}/5)
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Restart Button on hover */}
      <button 
        onClick={() => setSequenceKey(prev => prev + 1)}
        className="absolute bottom-1 right-2 text-[0.55rem] font-bold text-neutral-500 hover:text-white uppercase tracking-wider transition-colors z-20 cursor-pointer"
      >
        Restart Grid
      </button>
    </div>
  );
};

// Custom interactive stat card
const AnimatedStatCard = ({ title, value, description, icon: Icon, color = "text-primary" }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-lg border border-border/60 bg-background/40 p-4 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-neutral-400">{title}</p>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <p className="font-racing text-2xl font-black text-white leading-none tracking-wider mb-1">
          {value}
        </p>
      </div>
      <p className="text-[0.65rem] text-muted-foreground mt-2">{description}</p>
    </motion.div>
  );
};

// Trivia questions list
const TRIVIA_QUESTIONS = [
  {
    question: "Who won the first ever Formula 1 World Drivers' Championship in 1950?",
    options: ["Juan Manuel Fangio", "Giuseppe Farina", "Alberto Ascari", "Stirling Moss"],
    correctIndex: 1,
    explanation: "Giuseppe 'Nino' Farina won the inaugural 1950 World Championship driving an Alfa Romeo, clinching the title at the final race in Monza."
  },
  {
    question: "Which iconic circuit has hosted the most Formula 1 Grands Prix in history?",
    options: ["Monaco", "Silverstone", "Spa-Francorchamps", "Monza"],
    correctIndex: 3,
    explanation: "Monza (Autodromo Nazionale Monza), home of the Italian Grand Prix, has hosted the most races in F1 history, missing only the 1980 season."
  },
  {
    question: "Which team holds the record for the most Constructors' Championships in F1 history?",
    options: ["McLaren", "Williams", "Ferrari", "Mercedes"],
    correctIndex: 2,
    explanation: "Ferrari is the most successful constructor in F1 history, holding a record 16 World Constructors' Championships (WCC)."
  },
  {
    question: "Who holds the record for the most pole positions in Formula 1 history?",
    options: ["Michael Schumacher", "Ayrton Senna", "Lewis Hamilton", "Sebastian Vettel"],
    correctIndex: 2,
    explanation: "Lewis Hamilton holds the all-time record for the most pole positions, with 104 starts from the front spot."
  },
  {
    question: "In what year did the current hybrid turbo-engine (V6 Turbo Hybrid) era begin?",
    options: ["2009", "2012", "2014", "2016"],
    correctIndex: 2,
    explanation: "The 1.6-liter V6 Turbocharged Hybrid power units were introduced in 2014, replacing the high-revving 2.4-liter V8 engines."
  }
];

const Index = () => {
  const [now, setNow] = useState(() => new Date());
  const { data: scheduleData } = useQuery({ queryKey: ["schedule"], queryFn: fetchSchedule });
  const races = scheduleData?.races ?? [];
  const season = scheduleData?.season ?? "2026";

  const nextRace = useMemo(() => getNextRace(races, now), [races, now]);
  const nextLockClose = useMemo(() => getNextLockCloseUtc(races, now), [races, now]);

  // Trivia Quiz State
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [triviaFinished, setTriviaFinished] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const nextLockInLabel = nextLockClose ? formatLockInIst(nextLockClose) : "—";

  const currentQuestion = TRIVIA_QUESTIONS[triviaIdx];

  const handleOptionClick = (idx: number) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextTrivia = () => {
    setSelectedOpt(null);
    setShowExplanation(false);
    if (triviaIdx < TRIVIA_QUESTIONS.length - 1) {
      setTriviaIdx((prev) => prev + 1);
    } else {
      setTriviaFinished(true);
    }
  };

  const resetTrivia = () => {
    setTriviaIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setTriviaFinished(false);
  };

  return (
    <div className="min-h-screen bg-carbon pt-20 pb-safe sm:pt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-3 pb-12 sm:px-4 sm:pb-16 relative z-10">
        
        {/* Starting Lights & Hero Grid */}
        <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Hero Left */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center h-full"
          >
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.35em] text-red-500 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              FORMULA 1 SEASON {season}
            </p>
            
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <motion.img
                src="/f1-logo.png"
                alt="Formula 1"
                className="f1-logo-transparent h-14 w-auto object-contain sm:h-16 lg:h-20"
                whileHover={{ rotate: [-2, 2, -2, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <h1 className="font-f1 text-4xl tracking-[0.12em] text-gradient-red sm:text-5xl lg:text-6xl leading-[1.05]">
                F1 FANTASY
                <br />
                DELHI NCR
              </h1>
            </div>
            
            <p className="mb-6 max-w-xl text-sm text-neutral-300 sm:text-base leading-relaxed">
              Assemble your ultimate dream roster of 5 elite drivers and 2 constructor teams. Compete against the most passionate local F1 enthusiasts in Delhi NCR. Climb the telemetry standings boards race weekend after race weekend!
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button size="lg" className="min-h-[46px] w-full font-racing tracking-[0.2em] sm:w-auto glow-red transition-all duration-300 hover:scale-105 active:scale-95" asChild>
                <Link to="/my-team">
                  <Users className="mr-2.5 h-4 w-4 shrink-0" />
                  CREATE YOUR TEAM
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="min-h-[46px] w-full border border-border/70 bg-background/50 font-racing tracking-[0.2em] sm:w-auto hover:bg-neutral-900 transition-all duration-300 hover:scale-105 active:scale-95"
                asChild
              >
                <Link to="/leaderboard">
                  LEADERBOARD
                  <ArrowRight className="ml-2.5 h-4 w-4 shrink-0" />
                </Link>
              </Button>
            </div>

            {/* Quick stats board */}
            <div className="grid gap-3 text-xs sm:grid-cols-3 sm:text-sm">
              <AnimatedStatCard 
                title="Champions"
                value={`${season} Season`}
                description="Regulation Era"
                icon={Trophy}
                color="text-yellow-500"
              />
              <AnimatedStatCard 
                title="Race Weekends"
                value="22 Grands Prix"
                description="Non-stop Action"
                icon={Flag}
                color="text-red-500"
              />
              <AnimatedStatCard 
                title="Next Lock-In"
                value={nextLockInLabel.split(" • ")[0]}
                description={nextLockInLabel.split(" • ")[1] || "Before Qualifying Q1"}
                icon={Activity}
                color="text-emerald-400"
              />
            </div>
          </motion.div>

          {/* Hero Right: Next Race & Start Lights */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-5 w-full"
          >
            {/* Interactive starting lights gantry */}
            <F1StartingLights />

            {/* Next Race Card */}
            <Card className="glow-red border-primary/30 bg-gradient-to-br from-[#121215]/95 to-[#16161c]/80 backdrop-blur-md overflow-hidden relative group">
              {/* Corner carbon pattern decorative effect */}
              <div className="absolute top-0 right-0 w-24 h-1 bg-red-600 shadow-[0_0_20px_#ef4444]" />
              <CardHeader className="pb-3">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-red-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  NEXT UPCOMING RACE
                </p>
                <CardTitle className="font-racing text-2xl tracking-[0.15em] text-white">
                  {nextRace ? nextRace.name : "—"}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  {nextRace
                    ? `Lock in your team picks before Q1. Points accumulate automatically.`
                    : races.length > 0
                      ? "Season complete. See you next year!"
                      : "Schedule loading…"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm pt-0">
                {nextRace ? (
                  <>
                    <div className="grid gap-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/10 p-3 hover:bg-secondary/20 transition-colors">
                        <span className="text-neutral-400">Circuit Venue</span>
                        <span className="font-semibold text-white">{nextRace.circuit || nextRace.location}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/10 p-3 hover:bg-secondary/20 transition-colors">
                        <span className="text-neutral-400">Race Date</span>
                        <span className="font-semibold text-white">{nextRace.date} {nextRace.localTime ? `• ${nextRace.localTime}` : ""}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/10 p-3 hover:bg-secondary/20 transition-colors">
                        <span className="text-neutral-400">Lock-in Freeze (Q1)</span>
                        <span className="font-semibold text-gradient-gold">{nextLockClose ? formatLockInIst(nextLockClose) : "—"}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-racing text-xs tracking-[0.2em] border-neutral-700 bg-black/40 hover:bg-neutral-800 transition-all hover:scale-[1.01]"
                      asChild
                    >
                      <Link to="/schedule">VIEW FULL SCHEDULE</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-racing text-xs tracking-[0.2em]"
                    asChild
                  >
                    <Link to="/schedule">VIEW FULL SCHEDULE</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Official F1 2026 Season Anthem Showcase */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 border border-border/60 bg-[#0f0f12]/90 backdrop-blur-md rounded-xl p-5 md:p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-red-500">
              🏁 COCKPIT AUDIO & SCANNERS ON
            </p>
            <h2 className="font-racing text-2xl font-black tracking-[0.15em] text-foreground sm:text-3xl leading-none">
              🎙️ BOX, BOX! LIGHTS OUT AND AWAY WE GO!
            </h2>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            {/* Theater Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-neutral-800 shadow-2xl">
              <F1VideoPlayer 
                videoUrl="GpCE9Feyteg" 
                start={0}
                title="BOX, BOX! LIGHTS OUT AND AWAY WE GO!"
              />
            </div>
            <p className="text-center text-xs text-neutral-400 mt-3.5 italic leading-relaxed">
              Play with audio enabled to experience the legendary F1 opening titles soundscape!
            </p>
          </div>
        </motion.section>

        {/* Interactive F1 Trivia Challenge */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-16 border border-border/60 bg-[#0f0f12]/90 backdrop-blur-md rounded-xl p-5 md:p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Carbon Fiber border detail */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" />
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-red-500">
                TEST YOUR MOTORSPORTS IQ
              </p>
              <h2 className="font-racing text-2xl font-black tracking-[0.15em] text-foreground sm:text-3xl leading-none flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-red-500" />
                F1 TELEMETRY TRIVIA CHALLENGE
              </h2>
            </div>
            {!triviaFinished && (
              <span className="text-xs font-mono font-bold bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-md text-neutral-300">
                Q: {triviaIdx + 1}/{TRIVIA_QUESTIONS.length}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {triviaFinished ? (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center mb-4 text-yellow-500 animate-bounce">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="font-racing text-xl font-bold tracking-[0.15em] text-white mb-2">
                  TRIVIA CHALLENGE COMPLETED!
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                  You scored <span className="font-bold text-yellow-500 text-lg">{score}</span> out of <span className="font-bold text-white text-lg">{TRIVIA_QUESTIONS.length}</span>! 
                  {score === TRIVIA_QUESTIONS.length 
                    ? " Perfect score! You are a certified F1 Race Strategist! 🏆" 
                    : score >= 3 
                      ? " Solid drive! You have great knowledge of F1 history. 🏎️" 
                      : " Keep pushing! Review the telemetry and try again. 🔋"}
                </p>
                <Button 
                  onClick={resetTrivia}
                  className="font-racing text-xs tracking-wider px-5 py-2 hover:scale-105 transition-transform"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  RESTART CHALLENGE
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={triviaIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 md:grid-cols-[1.2fr_1fr]"
              >
                {/* Question & Choices */}
                <div className="flex flex-col justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-snug">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOpt === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;
                      
                      let btnClass = "border-border bg-secondary/15 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500";
                      let indicatorIcon = null;

                      if (showExplanation) {
                        if (isCorrect) {
                          btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-300 glow-green";
                          indicatorIcon = <Check className="h-4 w-4 text-emerald-400 shrink-0" />;
                        } else if (isSelected) {
                          btnClass = "border-red-500 bg-red-500/10 text-red-300 glow-red";
                          indicatorIcon = <X className="h-4 w-4 text-red-400 shrink-0" />;
                        } else {
                          btnClass = "border-border bg-neutral-900/40 text-neutral-500 opacity-60 pointer-events-none";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={showExplanation}
                          onClick={() => handleOptionClick(idx)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${btnClass} ${!showExplanation ? "hover:scale-[1.015] active:scale-95" : ""}`}
                        >
                          <span>{opt}</span>
                          {indicatorIcon}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation / Result */}
                <div className="flex flex-col justify-center bg-secondary/10 border border-neutral-800/60 rounded-lg p-5 min-h-[200px] relative">
                  <AnimatePresence mode="wait">
                    {showExplanation ? (
                      <motion.div
                        key="explanation"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col h-full justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {selectedOpt === currentQuestion.correctIndex ? (
                              <span className="text-xs font-black tracking-wider uppercase text-emerald-400 flex items-center gap-1">
                                <Check className="h-4 w-4" /> Correct Answer!
                              </span>
                            ) : (
                              <span className="text-xs font-black tracking-wider uppercase text-red-500 flex items-center gap-1">
                                <X className="h-4 w-4" /> Incorrect Answer
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                        
                        <Button
                          onClick={handleNextTrivia}
                          className="mt-5 w-full font-racing text-xs tracking-widest hover:scale-102 active:scale-95 transition-transform"
                        >
                          {triviaIdx === TRIVIA_QUESTIONS.length - 1 ? "FINISH CHALLENGE" : "NEXT QUESTION"}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center py-6 text-neutral-500"
                      >
                        <HelpCircle className="h-10 w-10 mb-2 animate-pulse text-neutral-600" />
                        <p className="text-xs uppercase tracking-widest font-mono">
                          Select an option to view telemetry explanation
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* How it works */}
        <section className="mt-16 space-y-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-red-500">
              HOW IT WORKS
            </p>
            <h2 className="font-racing text-2xl font-black tracking-[0.15em] text-foreground sm:text-3xl">
              THREE STEPS TO F1 GLORY IN DELHI NCR
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Assemble Your Roster",
                desc: "Choose 5 budget-cap drivers and 2 constructor teams from the grid. Strategize values carefully to stay within the limit!"
              },
              {
                step: "02",
                title: "Live Race telemetry",
                desc: "Your selected lineup accumulates points dynamically based on real-time F1 grid results (Positions, Poles, Wins)."
              },
              {
                step: "03",
                title: "Claim League Glory",
                desc: "Compare scoreboards and climb the rank standings of the Delhi NCR community to seal your ultimate fantasy champion status."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 + 0.3 }}
              >
                <Card className="border-border/60 bg-background/60 hover:border-primary/40 transition-all duration-300 group hover:shadow-xl h-full flex flex-col justify-between">
                  <CardHeader className="pb-4">
                    <p className="mb-2 text-sm font-black tracking-widest text-primary font-mono group-hover:scale-105 transition-transform">
                      {item.step}
                    </p>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA with responsive animations */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 rounded-xl border border-border/60 bg-background/60 p-6 sm:p-8 relative overflow-hidden group hover:border-primary/30 transition-colors"
        >
          {/* Subtle red indicator border */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
          
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-red-500">
                READY TO RACE?
              </p>
              <h3 className="font-racing text-2xl font-black tracking-[0.15em] text-foreground sm:text-3xl leading-snug">
                JOIN THE DELHI NCR F1 COMMUNITY TODAY!
              </h3>
            </div>
            <Button size="lg" className="font-racing tracking-[0.2em] w-full sm:w-auto glow-red hover:scale-105 active:scale-95 transition-all duration-300 shrink-0" asChild>
              <Link to="/my-team">GET STARTED</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
