import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Medal, Star } from "lucide-react";
import { type Driver } from "@/data/drivers";
import { driverAchievements } from "@/data/driverAchievements";
import { useState } from "react";
import F1VideoPlayer from "./F1VideoPlayer";

type DriverDetailsModalProps = {
  driver: Driver;
  onClose: () => void;
};

export default function DriverDetailsModal({ driver, onClose }: DriverDetailsModalProps) {
  const [imgError, setImgError] = useState(false);
  const achievements = driverAchievements[driver.id];

  // Default fallback values if a driver doesn't have custom achievements mapped yet
  const defaultAchievements = {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: `No: ${driver.number} | Team: ${driver.team}`,
    videoUrl: "wHNgoRCWqTg", // General F1 highlight
    start: 0,
    fontFamily: "sans-serif",
    themeColor: driver.teamColor,
    highlightText: `${driver.name.toUpperCase()} — 2026 EVENT CONTENDER 🏎️`,
    achievements: [
      `Professional Formula 1 driver representing ${driver.team}`,
      `Races under the flag of ${driver.nationality} ${driver.flag}`,
      `Car Number ${driver.number}`,
      `Valued at ₹${driver.price}M in the 2026 fantasy league`
    ]
  };

  const ach = achievements || defaultAchievements;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        {/* Backdrop clickable area to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative max-w-3xl w-full bg-[#111112] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 hover:scale-105 text-white/80 hover:text-white rounded-full p-2 z-50 transition-all border border-neutral-700/40 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Top Section: Netflix-Style Video Preview */}
          <div className="relative h-48 sm:h-64 w-full bg-black overflow-hidden select-none">
            <F1VideoPlayer 
              videoUrl={ach.videoUrl} 
              start={ach.start || 0} 
              title={`${driver.name} Preview`}
              className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 scale-105 border-0 opacity-80"
            />
            
            <div className="absolute bottom-4 left-6 z-10 hidden sm:block">
              <span 
                className="text-xs uppercase tracking-widest px-2.5 py-1 rounded bg-black/50 border backdrop-blur-sm"
                style={{ color: ach.themeColor, borderColor: `${ach.themeColor}40` }}
              >
                Best Moment Preview
              </span>
            </div>
          </div>


          {/* Bottom Section: Driver Info & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6">
            
            {/* Left Column: Enlarged Driver Portrait */}
            <div className="md:col-span-4 flex flex-col items-center gap-3">
              <div 
                className="w-40 h-40 md:w-full md:h-60 rounded-lg overflow-hidden border-2 shadow-lg bg-secondary/30 relative"
                style={{ borderColor: ach.themeColor }}
              >
                {driver.photoUrl && !imgError ? (
                  <img
                    src={driver.photoUrl}
                    alt={driver.name}
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  // Gorgeous SVG Helmet Fallback inside the modal
                  <div className="w-full h-full flex items-center justify-center p-4" style={{ color: driver.teamColor }}>
                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                      <path d="M20 50 C20 22, 80 22, 80 50 C80 65, 75 72, 50 75 C25 72, 20 65, 20 50 Z" opacity="0.85" />
                      <path d="M28 44 C28 38, 72 38, 72 44 C72 50, 62 53, 50 53 C38 53, 28 50, 28 44 Z" fill="#111" stroke="currentColor" strokeWidth="1.5" />
                      <text x="50" y="32" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#fff" fontFamily="monospace">{driver.number}</text>
                    </svg>
                  </div>
                )}
                
                {/* Driver Number Badge */}
                <div 
                  className="absolute bottom-2 right-2 text-sm font-black font-mono px-2 py-0.5 rounded text-white shadow-md border"
                  style={{ backgroundColor: ach.themeColor, borderColor: `${ach.themeColor}80` }}
                >
                  #{driver.number}
                </div>
              </div>

              {/* Price pill */}
              <div className="w-full text-center">
                <span className="inline-block text-xs uppercase tracking-wider text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full border">
                  Value: <strong className="text-foreground">₹{driver.price}M</strong>
                </span>
              </div>
            </div>

            {/* Right Column: Achievements & Stats */}
            <div className="md:col-span-8 flex flex-col justify-between" style={{ fontFamily: ach.fontFamily }}>
              <div>
                {/* Header */}
                <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                  <h2 
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: ach.themeColor }}
                  >
                    {driver.name}
                  </h2>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>{driver.flag}</span>
                    <span>{driver.nationality}</span>
                  </span>
                </div>

                {/* Team Subtitle */}
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
                  {driver.team}
                </p>

                {/* Highlight Tagline */}
                <div 
                  className="text-xs sm:text-sm font-black italic tracking-wide mb-5 flex items-center gap-2 border-l-2 pl-3 py-0.5"
                  style={{ borderColor: ach.themeColor, color: `${ach.themeColor}f0` }}
                >
                  <Star className="h-4 w-4 fill-current shrink-0" />
                  {ach.highlightText}
                </div>

                {/* Achievements List */}
                <div className="space-y-2.5 mb-6">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    Key Milestones
                  </h3>
                  {ach.achievements.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-start gap-2.5 text-sm text-foreground/90"
                    >
                      <Medal className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" style={{ color: `${ach.themeColor}b0` }} />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats dashboard footer */}
              <div 
                className="rounded-lg p-3 border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-secondary/15 backdrop-blur-sm"
                style={{ borderColor: `${ach.themeColor}20` }}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: ach.themeColor }} />
                  <span className="text-muted-foreground uppercase tracking-widest text-[0.65rem]"> telemetry career:</span>
                </div>
                <span className="font-bold tracking-wide text-foreground uppercase">
                  {ach.statsLabel}
                </span>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
