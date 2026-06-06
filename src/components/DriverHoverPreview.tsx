import { motion, AnimatePresence } from "framer-motion";
import { type Driver } from "@/data/drivers";
import { driverAchievements } from "@/data/driverAchievements";
import { Trophy, Star } from "lucide-react";
import { useState, useEffect } from "react";
import F1VideoPlayer from "./F1VideoPlayer";

type DriverHoverPreviewProps = {
  driver: Driver | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
};

export default function DriverHoverPreview({ driver, onMouseEnter, onMouseLeave, onClose }: DriverHoverPreviewProps) {
  // Keep track of the last active driver to prevent visual details from snapping to empty state during exit animation
  const [activeDriver, setActiveDriver] = useState<Driver | null>(null);

  useEffect(() => {
    if (driver) {
      setActiveDriver(driver);
    }
  }, [driver]);

  const currentDriver = driver || activeDriver;

  if (!currentDriver) return null;

  const achievements = driverAchievements[currentDriver.id];
  const defaultAchievements = {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: `No: ${currentDriver.number} | Team: ${currentDriver.team}`,
    videoUrl: "wHNgoRCWqTg",
    start: 0,
    fontFamily: "sans-serif",
    themeColor: currentDriver.themeColor,
    highlightText: `${currentDriver.name.toUpperCase()} — CONTENDER 🏎️`,
    achievements: [
      `F1 Driver for ${currentDriver.team}`,
      `Races under nationality ${currentDriver.nationality}`
    ]
  };

  const ach = achievements || defaultAchievements;

  return (
    <AnimatePresence>
      {driver && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm pointer-events-auto cursor-pointer"
            onClick={onClose}
          />
          
          {/* Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: "-50%", 
              y: "-50%",
              borderColor: `${ach.themeColor}80`
            }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="fixed top-1/2 left-1/2 z-50 bg-[#111113]/95 border-2 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden w-[94vw] sm:w-[500px] flex flex-col backdrop-blur-md pointer-events-auto"
          >
            {/* Inner Content that crossfades when driver ID changes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDriver.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col w-full h-full"
              >
                {/* Top: Auto-playing Preview Video (Immersive Audio Player) */}
                <div className="relative h-60 sm:h-64 bg-black overflow-hidden select-none">
                  <F1VideoPlayer 
                    videoUrl={ach.videoUrl} 
                    start={ach.start || 0} 
                    title={`${currentDriver.name} Hover Preview`}
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-5 flex flex-col gap-4.5 sm:gap-3.5" style={{ fontFamily: ach.fontFamily }}>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-3.5 sm:pb-3">
                    <div>
                      <h4 className="text-2xl sm:text-lg font-black tracking-tight" style={{ color: ach.themeColor }}>
                        {currentDriver.name}
                      </h4>
                      <p className="text-sm sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                        {currentDriver.team}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-1.5">
                      <span className="text-lg sm:text-sm">{currentDriver.flag}</span>
                      <span className="text-sm sm:text-xs font-bold text-neutral-400">#{currentDriver.number}</span>
                    </div>
                  </div>

                  {/* Highlight Line */}
                  <div 
                    className="text-sm sm:text-[0.8rem] font-black italic tracking-wide flex items-center gap-2 border-l-2 pl-3.5 py-0.5"
                    style={{ borderColor: ach.themeColor, color: `${ach.themeColor}e0` }}
                  >
                    <Star className="h-4 w-4 fill-current shrink-0" />
                    {ach.highlightText}
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 py-1">
                    <div className="bg-secondary/20 rounded-lg border border-neutral-800/40 p-2.5 text-center">
                      <span className="block text-xs sm:text-[0.6rem] text-muted-foreground uppercase tracking-widest">Wins</span>
                      <strong className="text-lg sm:text-sm font-racing font-bold text-foreground">{ach.wins}</strong>
                    </div>
                    <div className="bg-secondary/20 rounded-lg border border-neutral-800/40 p-2.5 text-center">
                      <span className="block text-xs sm:text-[0.6rem] text-muted-foreground uppercase tracking-widest">Podiums</span>
                      <strong className="text-lg sm:text-sm font-racing font-bold text-foreground">{ach.podiums}</strong>
                    </div>
                    <div className="bg-secondary/20 rounded-lg border border-neutral-800/40 p-2.5 text-center">
                      <span className="block text-xs sm:text-[0.6rem] text-muted-foreground uppercase tracking-widest">Titles</span>
                      <strong className="text-lg sm:text-sm font-racing font-bold text-foreground">{ach.championships}</strong>
                    </div>
                  </div>

                  {/* Achievements bullets */}
                  <div className="space-y-2 sm:space-y-1.5 mt-1">
                    <span className="text-xs sm:text-[0.65rem] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      Achievements
                    </span>
                    <div className="space-y-2.5 sm:space-y-2 pl-1">
                      {ach.achievements.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-sm sm:text-[0.8rem] text-white/90 flex items-start gap-2.5 leading-snug">
                          <span className="text-sm shrink-0" style={{ color: ach.themeColor }}>•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer price tag */}
                  <div className="border-t border-neutral-800/60 pt-3.5 flex items-center justify-between text-xs sm:text-xs text-muted-foreground mt-1">
                    <span className="text-xs uppercase tracking-wider">VALUE / LEAGUE PRICE:</span>
                    <strong className="text-accent font-racing text-lg sm:text-sm">₹{currentDriver.price}M</strong>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


