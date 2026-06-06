import { useState } from "react";
import { type Driver } from "@/data/drivers";
import { type Constructor } from "@/data/constructors";

type DriverAvatarProps = {
  driver: Driver;
  className?: string;
};

export function DriverAvatar({ driver, className = "h-10 w-10" }: DriverAvatarProps) {
  const [error, setError] = useState(false);

  if (driver.photoUrl && !error) {
    return (
      <img
        src={driver.photoUrl}
        alt={driver.name}
        className={`${className} object-cover object-top rounded-full border bg-secondary`}
        style={{ borderColor: driver.teamColor }}
        onError={() => setError(true)}
      />
    );
  }

  // Beautiful SVG Helmet Fallback
  return (
    <div className={`${className} flex items-center justify-center rounded-full bg-secondary border relative overflow-hidden`} style={{ borderColor: driver.teamColor }}>
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" style={{ color: driver.teamColor }}>
        {/* Helmet shell */}
        <path
          d="M20 50 C20 22, 80 22, 80 50 C80 65, 75 72, 50 75 C25 72, 20 65, 20 50 Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Helmet Visor */}
        <path
          d="M28 44 C28 38, 72 38, 72 44 C72 50, 62 53, 50 53 C38 53, 28 50, 28 44 Z"
          fill="#111111"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Chin bar details */}
        <path d="M42 66 L58 66 L55 71 L45 71 Z" fill="#111111" opacity="0.6" />
        {/* Driver number */}
        <text
          x="50"
          y="32"
          fontSize="15"
          fontWeight="bold"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="monospace"
        >
          {driver.number}
        </text>
      </svg>
    </div>
  );
}

type ConstructorLiveryProps = {
  constructor: Constructor;
  className?: string;
};

export function ConstructorLivery({ constructor, className = "h-8 w-auto" }: ConstructorLiveryProps) {
  const [error, setError] = useState(false);

  if (constructor.liveryUrl && !error) {
    return (
      <img
        src={constructor.liveryUrl}
        alt={constructor.name}
        className={`${className} object-contain`}
        onError={() => setError(true)}
      />
    );
  }

  // Sleek SVG F1 Car Profile Fallback
  return (
    <div className={`${className} flex items-center justify-center p-1`}>
      <svg viewBox="0 0 160 50" className="w-full h-full" style={{ color: constructor.teamColor }}>
        {/* Floor and chassis plate */}
        <rect x="35" y="36" width="95" height="3" rx="1" fill="#1e1e1e" />
        
        {/* Front wing assembly */}
        <rect x="5" y="33" width="22" height="4" rx="1" fill="currentColor" />
        <path d="M22 33 L26 26 L30 33 Z" fill="currentColor" opacity="0.8" />
        
        {/* Nose cone and cockpit */}
        <path
          d="M26 33 L55 24 L75 22 L98 24 L108 30 L135 34 Z"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Engine cover and sidepods */}
        <path
          d="M65 24 C80 18, 110 18, 122 26 L138 34 L145 34 L142 16 L148 16 L146 34 Z"
          fill="currentColor"
        />
        
        {/* Rear wing assembly */}
        <path d="M136 18 L149 18 L147 8 L134 8 Z" fill="currentColor" />
        <rect x="141" y="8" width="5" height="26" fill="currentColor" opacity="0.85" />
        
        {/* Rear wing endplates */}
        <rect x="147" y="6" width="2" height="15" fill="#111111" />
        
        {/* Front wheel */}
        <circle cx="36" cy="31" r="11" fill="#181818" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="36" cy="31" r="5" fill="#2c2c2c" />
        
        {/* Rear wheel */}
        <circle cx="118" cy="31" r="12" fill="#181818" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="118" cy="31" r="5" fill="#2c2c2c" />
      </svg>
    </div>
  );
}
