import { motion, AnimatePresence } from "framer-motion";
import { type Constructor } from "@/data/constructors";
import { constructorAchievements } from "@/data/constructorAchievements";
import { Trophy, Star, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import F1VideoPlayer from "./F1VideoPlayer";
import { ConstructorLivery } from "./F1Assets";

type ConstructorHoverPreviewProps = {
  constructor: Constructor | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
};

export default function ConstructorHoverPreview({
  constructor,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: ConstructorHoverPreviewProps) {
  // Keep track of the last active constructor during exit transitions to prevent layout layout/detail resets
  const [activeConstructor, setActiveConstructor] = useState<Constructor | null>(null);

  useEffect(() => {
    if (constructor) {
      setActiveConstructor(constructor);
    }
  }, [constructor]);

  const currentConstructor = constructor || activeConstructor;

  if (!currentConstructor) return null;

  const achievements = constructorAchievements[currentConstructor.id];
  const defaultAchievements = {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: `Constructor Team: ${currentConstructor.name}`,
    videoUrl: "wHNgoRCWqTg",
    start: 0,
    fontFamily: "sans-serif",
    themeColor: currentConstructor.teamColor,
    highlightText: `${currentConstructor.name.toUpperCase()} — CONTENDER 🏎️`,
    achievements: [
      `F1 Constructor Team`,
      `Competes in the 2026 Regulation Era`
    ]
  };

  const ach = achievements || defaultAchievements;

  return (
    <AnimatePresence>
      {constructor && (
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
            className="fixed top-1/2 left-1/2 z-50 bg-[#111113]/95 border-2 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden w-[90vw] sm:w-[500px] flex flex-col backdrop-blur-md pointer-events-auto"
          >
            {/* Inner Content that crossfades when constructor ID changes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentConstructor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col w-full h-full"
              >
                {/* Top: Auto-playing Preview Video (Immersive Audio Player) */}
                <div className="relative h-56 sm:h-64 bg-black overflow-hidden select-none">
                  <F1VideoPlayer 
                    videoUrl={ach.videoUrl} 
                    start={ach.start || 0} 
                    title={`${currentConstructor.name} Hover Preview`}
                  />
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-3.5" style={{ fontFamily: ach.fontFamily }}>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-1.5 h-8 rounded-full" 
                        style={{ backgroundColor: ach.themeColor }}
                      />
                      <div>
                        <h4 className="text-lg font-black tracking-tight" style={{ color: ach.themeColor }}>
                          {currentConstructor.name}
                        </h4>
                        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-semibold">
                          Formula 1 Constructor
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1 rounded-md border border-neutral-800/40">
                      <Shield className="h-3.5 w-3.5" style={{ color: ach.themeColor }} />
                      <span className="text-xs font-bold text-neutral-300">WCC</span>
                    </div>
                  </div>

                  {/* Highlight Line */}
                  <div 
                    className="text-[0.8rem] font-black italic tracking-wide flex items-center gap-2 border-l-2 pl-3 py-0.5"
                    style={{ borderColor: ach.themeColor, color: `${ach.themeColor}e0` }}
                  >
                    <Star className="h-4 w-4 fill-current shrink-0" />
                    {ach.highlightText}
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-2.5 py-1">
                    <div className="bg-secondary/20 rounded-lg border border-neutral-800/40 p-2 text-center">
                      <span className="block text-[0.6rem] text-muted-foreground uppercase tracking-widest">WCC Titles</span>
                      <strong className="text-sm font-racing font-bold text-foreground">{ach.championships}</strong>
                    </div>
                    <div className="bg-secondary/20 rounded-lg border border-neutral-800/40 p-2 text-center">
                      <span className="block text-[0.6rem] text-muted-foreground uppercase tracking-widest">Wins</span>
                      <strong className="text-sm font-racing font-bold text-foreground">{ach.wins}</strong>
                    </div>
                    <div className="bg-secondary/20 rounded-lg border border-neutral-800/40 p-2 text-center">
                      <span className="block text-[0.6rem] text-muted-foreground uppercase tracking-widest">Podiums</span>
                      <strong className="text-sm font-racing font-bold text-foreground">{ach.podiums}</strong>
                    </div>
                  </div>

                  {/* Achievements bullets */}
                  <div className="space-y-1.5 mt-1">
                    <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                      Team Legacy & Milestones
                    </span>
                    <div className="space-y-2 pl-1">
                      {ach.achievements.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-[0.8rem] text-white/90 flex items-start gap-2 leading-snug">
                          <span className="text-xs shrink-0" style={{ color: ach.themeColor }}>•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Livery Showcase in hover footer */}
                  <div className="border-t border-neutral-800/60 pt-3 flex items-center justify-between mt-1 gap-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wider">2026 Livery preview</span>
                      <span className="text-[0.65rem] font-bold text-neutral-400">₹{currentConstructor.price}M Roster Price</span>
                    </div>
                    <div className="bg-secondary/10 border border-neutral-800/45 rounded-lg px-3 py-1 flex items-center justify-center">
                      <ConstructorLivery constructor={currentConstructor} className="h-7 w-auto object-contain" />
                    </div>
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
