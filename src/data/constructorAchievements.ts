export type ConstructorAchievement = {
  wins: number;
  podiums: number;
  championships: number;
  statsLabel: string;
  videoUrl: string; // YouTube video ID or local MP4 path
  start?: number;
  fontFamily: string;
  themeColor: string;
  highlightText: string;
  achievements: string[];
};

export const constructorAchievements: Record<string, ConstructorAchievement> = {
  mclaren: {
    wins: 188,
    podiums: 522,
    championships: 8,
    statsLabel: "Wins: 188 | Podiums: 522 | WCC Titles: 8",
    videoUrl: "/mclaren.mp4",
    start: 0,
    fontFamily: "'Outfit', sans-serif",
    themeColor: "#FF8700",
    highlightText: "CHAMPIONSHIP REAWAKENING 🧡",
    achievements: [
      "2025 WCC Title Runner-up & IndyCar/Le Mans Triple Crown",
      "Legendary status with Senna, Prost, and Hakkinen",
      "522 podium finishes in Formula 1 history",
      "State-of-the-art MTC Wind Tunnel facility"
    ]
  },
  mercedes: {
    wins: 128,
    podiums: 296,
    championships: 8,
    statsLabel: "Wins: 128 | Podiums: 296 | WCC Titles: 8",
    videoUrl: "/mercedes.mp4",
    start: 0,
    fontFamily: "'Outfit', sans-serif",
    themeColor: "#00D2BE",
    highlightText: "8-TIME CONSECUTIVE WCC MONARCHS ⚡",
    achievements: [
      "Historic 8 consecutive WCC Titles (2014-2021)",
      "Unmatched V6 Turbo Hybrid power dominance",
      "Led by Toto Wolff with Silver Arrows racing heritage",
      "Promoting Kimi Antonelli & George Russell for 2026"
    ]
  },
  ferrari: {
    wins: 248,
    podiums: 825,
    championships: 16,
    statsLabel: "Wins: 248 | Podiums: 825 | WCC Titles: 16",
    videoUrl: "/ferrari.mp4",
    start: 0,
    fontFamily: "'Playfair Display', serif",
    themeColor: "#DC0000",
    highlightText: "THE LEGENDARY SCUDERIA RED GLORY 🔴",
    achievements: [
      "Oldest and most successful F1 team in history (16 WCCs)",
      "Iconic Maranello home representing national Italian pride",
      "Lewis Hamilton and Charles Leclerc driver lineup for 2026",
      "Only team to compete in every F1 season since 1950"
    ]
  },
  red_bull: {
    wins: 121,
    podiums: 280,
    championships: 6,
    statsLabel: "Wins: 121 | Podiums: 280 | WCC Titles: 6",
    videoUrl: "/redbull.mp4",
    start: 0,
    fontFamily: "'Rubik', sans-serif",
    themeColor: "#0600EF",
    highlightText: "THE ENERGY DRINK POWERHOUSE 👑",
    achievements: [
      "6 Constructors Championships (2010-2013, 2022-2023)",
      "Revolutionary Adrian Newey aerodynamic legacy",
      "Milton Keynes technological titan",
      "Led by Max Verstappen & rookie sensation Isack Hadjar"
    ]
  },
  williams: {
    wins: 114,
    podiums: 313,
    championships: 9,
    statsLabel: "Wins: 114 | Podiums: 313 | WCC Titles: 9",
    videoUrl: "/williams.mp4",
    start: 0,
    fontFamily: "'Orbitron', sans-serif",
    themeColor: "#005AFF",
    highlightText: "THE HISTORIC BRITISH RACING LEGACY 🇬🇧",
    achievements: [
      "9 Constructors Championships (3rd highest in history)",
      "Founded by legendary pioneer Sir Frank Williams",
      "Historic switch to Carlos Sainz alongside Alex Albon",
      "Rebuilding era with James Vowles at Grove"
    ]
  },
  rb: {
    wins: 2,
    podiums: 5,
    championships: 0,
    statsLabel: "Wins: 2 | Podiums: 5 | Red Bull Junior Team",
    videoUrl: "/vcarb.mp4",
    start: 0,
    fontFamily: "'Syncopate', sans-serif",
    themeColor: "#1432FF",
    highlightText: "THE JUNIOR CHAMPIONS INCUBATOR 🇮🇹",
    achievements: [
      "Historic Monza victories (Vettel 2008, Gasly 2020)",
      "Formerly Minardi, Toro Rosso, and AlphaTauri",
      "Faenza-based testing ground for future world champions",
      "Driver pairing Liam Lawson and Arvid Lindblad for 2026"
    ]
  },
  aston_martin: {
    wins: 0,
    podiums: 9,
    championships: 0,
    statsLabel: "Podiums: 9 | Poles: 1 | AMR Technology Campus",
    videoUrl: "/aston.mp4",
    start: 0,
    fontFamily: "'Cormorant Garamond', serif",
    themeColor: "#006F62",
    highlightText: "SILVERSTONE GREEN AMBITION 💚",
    achievements: [
      "Stunning 2023 season podium run with Fernando Alonso",
      "Brand-new AMR Technology Campus & wind tunnel at Silverstone",
      "Honda factory engine partnership starting in 2026",
      "Owned by Lawrence Stroll with hypercar technology ties"
    ]
  },
  haas: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "Poles: 1 | Best Finish: P4 | Haas CNC Power",
    videoUrl: "/haas.mp4",
    start: 0,
    fontFamily: "'Russo One', sans-serif",
    themeColor: "#B6BABD",
    highlightText: "THE STEADFAST AMERICAN REBEL 🇺🇸",
    achievements: [
      "Surprise Pole Position in Sao Paulo Grand Prix (2022)",
      "Unique multi-base operation (Kannapolis, Banbury, Maranello)",
      "Close technical partnership with Scuderia Ferrari",
      "Brand-new 2026 lineup featuring Esteban Ocon and Ollie Bearman"
    ]
  },
  audi: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "Sauber Legacy | Historic 2026 WEC Entry",
    videoUrl: "/audi.mp4",
    start: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    themeColor: "#A3A3A3",
    highlightText: "HISTORIC GERMAN WORKSTEAM DEBUT 🇩🇪",
    achievements: [
      "Full takeover of Sauber Motorsport (Hinwil state-of-the-art facility)",
      "German-built Neuburg power unit integration",
      "Championship legacy in Le Mans, WRC, and Formula E",
      "Nico Hulkenberg and Gabriel Bortoleto driving in 2026"
    ]
  },
  alpine: {
    wins: 1, // Alpine era win (Hungary 2021)
    podiums: 4,
    championships: 0, // 2 as Renault
    statsLabel: "Wins: 1 | Podiums: 4 | Renault Engine Era",
    videoUrl: "/alpine.mp4",
    start: 0,
    fontFamily: "'Exo 2', sans-serif",
    themeColor: "#0090FF",
    highlightText: "FRENCH ENSTONE RACING SPIRIT 🇫🇷",
    achievements: [
      "Esteban Ocon's spectacular 2021 Hungarian Grand Prix victory",
      "Dual-base operation in Enstone (chassis) and Viry-Chatillon (engine)",
      "Legendary heritage tracing back to Benetton & Renault titles",
      "Pierre Gasly and Franco Colapinto leading the team in 2026"
    ]
  },
  cadillac: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "Andretti Global Entry | Detroit Power",
    videoUrl: "/cadillac.mp4",
    start: 0,
    fontFamily: "'Syne', sans-serif",
    themeColor: "#1E1E24",
    highlightText: "AMERICAN RACING MAJESTY DEBUT 🇺🇸",
    achievements: [
      "Approved as the 11th team on the F1 grid starting in 2026",
      "Backed by General Motors (Cadillac) & Andretti Global",
      "State-of-the-art headquarters in Fishers, Indiana",
      "Lineup comprising F1 veterans Valtteri Bottas and Sergio Perez"
    ]
  }
};
