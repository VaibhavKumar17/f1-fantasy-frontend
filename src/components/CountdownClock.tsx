import { useState, useEffect } from "react";

type CountdownClockProps = {
  /** When the countdown reaches zero (e.g. Q1 start = lock closes) */
  targetUtc: Date;
  label: string;
  className?: string;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function CountdownClock({ targetUtc, label, className = "" }: CountdownClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = targetUtc.getTime() - now.getTime();
  const isPast = diff <= 0;

  if (isPast) {
    return (
      <div className={`rounded-lg border border-border/60 bg-zinc-900/90 px-4 py-3 font-mono text-sm ${className}`}>
        <p className="text-[0.65rem] uppercase tracking-widest text-zinc-500">{label}</p>
        <p className="mt-0.5 text-zinc-400">Locked</p>
      </div>
    );
  }

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((diff % (60 * 1000)) / 1000);

  return (
    <div
      className={`rounded-lg border border-zinc-600/80 bg-zinc-900/95 px-4 py-3 ${className}`}
      style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
    >
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <div className="mt-1.5 flex items-baseline gap-1.5 font-mono tabular-nums">
        {days > 0 && (
          <>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-lg font-bold text-white">
              {pad(days)}
            </span>
            <span className="text-xs text-zinc-500">d</span>
          </>
        )}
        <span className="rounded bg-red-950/80 px-1.5 py-0.5 text-lg font-bold text-red-400">
          {pad(h)}
        </span>
        <span className="text-zinc-600">:</span>
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-lg font-bold text-white">
          {pad(m)}
        </span>
        <span className="text-zinc-600">:</span>
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-lg font-bold text-white">
          {pad(s)}
        </span>
      </div>
      <p className="mt-1 text-[0.6rem] text-zinc-500">Tag Heuer</p>
    </div>
  );
}
