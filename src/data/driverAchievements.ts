export type DriverAchievement = {
  wins: number;
  podiums: number;
  championships: number;
  statsLabel: string;
  videoUrl: string; // YouTube Video ID
  start?: number; // Starting time in seconds
  fontFamily: string;
  themeColor: string;
  highlightText: string;
  achievements: string[];
};

export const driverAchievements: Record<string, DriverAchievement> = {
  norris: {
    wins: 10,
    podiums: 43,
    championships: 1,
    statsLabel: "Wins: 10 | Podiums: 43 | World Titles: 1 | Poles: 15",
    videoUrl: "/norris.mp4",
    start: 0,
    fontFamily: "'Outfit', sans-serif",
    themeColor: "#FF8700",
    highlightText: "LANDO'S MIAMI MASTERCLASS 🏆",
    achievements: [
      "2024 Miami Grand Prix Winner",
      "2025 World Drivers Championship Winner",
      "McLaren Racing Lead Driver",
      "43 F1 Podiums and counting"
    ]
  },
  piastri: {
    wins: 9,
    podiums: 27,
    championships: 0,
    statsLabel: "Wins: 9 | Podiums: 27 | Poles: 6",
    videoUrl: "/piastri.mp4",
    start: 0,
    fontFamily: "'Outfit', sans-serif",
    themeColor: "#FF8700",
    highlightText: "BUDAPEST & BAKU DOMINANCE 🍾",
    achievements: [
      "2024 Hungarian Grand Prix Winner",
      "2024 Azerbaijan Grand Prix Winner",
      "2023 Qatar Sprint Race Winner",
      "F1 Rookie of the Year (2023)"
    ]
  },
  russell: {
    wins: 5,
    podiums: 25,
    championships: 0,
    statsLabel: "Wins: 5 | Podiums: 25 | Poles: 7",
    videoUrl: "/russell.mp4",
    start: 0,
    fontFamily: "'Outfit', sans-serif",
    themeColor: "#00D2BE",
    highlightText: "MERCEDES COMMANDER ⚡",
    achievements: [
      "2022 Brazilian Grand Prix Winner",
      "2024 Austrian Grand Prix Winner",
      "GPDA Director & Mercedes Lead Driver",
      "Multiple Pole Positions at Silverstone & Spa"
    ]
  },
  antonelli: {
    wins: 4,
    podiums: 8,
    championships: 0,
    statsLabel: "Wins: 4 | Podiums: 8 | Poles: 3",
    videoUrl: "/kimi.mp4",
    start: 0,
    fontFamily: "'Outfit', sans-serif",
    themeColor: "#00D2BE",
    highlightText: "THE CHOSEN SUCCESSOR 🇮🇹",
    achievements: [
      "Promoted to Mercedes AMG F1 Team for 2026",
      "Formula 2 Race Winner & Karting Legend",
      "2023 FRECA Champion (Rookie Season)",
      "Double F4 Champion (Italian & ADAC)"
    ]
  },
  max_verstappen: {
    wins: 70,
    podiums: 127,
    championships: 4,
    statsLabel: "Wins: 70 | Podiums: 127 | World Titles: 4 | Poles: 48",
    videoUrl: "/verstappen.mp4",
    start: 0,
    fontFamily: "'Rubik', sans-serif",
    themeColor: "#FCD34D",
    highlightText: "RECORD-BREAKING DOMINANCE 👑",
    achievements: [
      "4-Time World Drivers Champion (2021-2024)",
      "Record for most wins in a single season (19)",
      "Youngest ever race winner in F1 history",
      "70 F1 Grand Prix victories"
    ]
  },
  hadjar: {
    wins: 0,
    podiums: 1,
    championships: 0,
    statsLabel: "Podiums: 1 | Red Bull Debutant",
    videoUrl: "/hadjar.mp4",
    start: 0,
    fontFamily: "'Rubik', sans-serif",
    themeColor: "#0600EF",
    highlightText: "RED BULL JUNIOR RISING STAR 🇫🇷",
    achievements: [
      "Promoted to Red Bull Racing Senior Team for 2026",
      "2025 FIA Formula 2 Championship Runner-up",
      "5 Feature Race Wins in Formula 2",
      "Helmut Marko's handpicked rookie"
    ]
  },
  leclerc: {
    wins: 7,
    podiums: 45,
    championships: 0,
    statsLabel: "Wins: 7 | Podiums: 45 | Poles: 27",
    videoUrl: "/leclerc.mp4",
    start: 0,
    fontFamily: "'Playfair Display', serif",
    themeColor: "#DC0000",
    highlightText: "MONZA CHOSEN ONE & IL PREDINATO 🔴",
    achievements: [
      "2-Time Monza Grand Prix Winner (2019, 2024)",
      "Scuderia Ferrari Lead Driver",
      "27 F1 Pole Positions (Ferrari Icon)",
      "2024 Monaco Grand Prix Winner (Home Glory)"
    ]
  },
  hamilton: {
    wins: 105,
    podiums: 203,
    championships: 7,
    statsLabel: "Wins: 105 | Podiums: 203 | World Titles: 7 | Poles: 104",
    videoUrl: "/hamilton.mp4",
    start: 0,
    fontFamily: "'Cinzel', serif",
    themeColor: "#DC0000",
    highlightText: "THE RED DAWN - FERRARI DEBUT 🏎️",
    achievements: [
      "Most F1 Wins (105) & Pole Positions (104) in history",
      "7-Time World Drivers Champion",
      "Legendary switch to Scuderia Ferrari for 2026",
      "First driver to reach 200 F1 Podiums"
    ]
  },
  albon: {
    wins: 0,
    podiums: 2,
    championships: 0,
    statsLabel: "Wins: 0 | Podiums: 2",
    videoUrl: "/albon.mp4",
    start: 0,
    fontFamily: "'Orbitron', sans-serif",
    themeColor: "#005AFF",
    highlightText: "WILLIAMS SAVIOUR & LEADER 🇹🇭",
    achievements: [
      "Lead Driver rebuilding Williams Racing",
      "Two-time podium finisher with Red Bull Racing",
      "Qualifying master & tire whisperer",
      "Over 240 career points in F1"
    ]
  },
  sainz: {
    wins: 4,
    podiums: 27,
    championships: 0,
    statsLabel: "Wins: 4 | Podiums: 27 | Poles: 6",
    videoUrl: "/sainz.mp4",
    start: 0,
    fontFamily: "'Orbitron', sans-serif",
    themeColor: "#005AFF",
    highlightText: "THE SMOOTH OPERATOR IN BLUE 🇪🇸",
    achievements: [
      "2023 Singapore Grand Prix Winner (Only non-RBR win)",
      "2024 Australian Grand Prix Winner",
      "New Williams F1 leader for 2026",
      "27 Career Podiums at Ferrari, McLaren & Renault"
    ]
  },
  lawson: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "Racing Bulls Lead | Points: 16",
    videoUrl: "/lawson.mp4",
    start: 0,
    fontFamily: "'Syncopate', sans-serif",
    themeColor: "#1432FF",
    highlightText: "RACING BULLS COMMANDER 🇳🇿",
    achievements: [
      "Full-time Lead Seat at Racing Bulls for 2026",
      "Stunning substitute debut in Singapore 2023 (P9)",
      "Super Formula Championship Runner-up",
      "Red Bull Junior graduate"
    ]
  },
  arvid_lindblad: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "Rookie Prodigy | Youngest Grid Starter",
    videoUrl: "/linblad.mp4",
    start: 0,
    fontFamily: "'Syncopate', sans-serif",
    themeColor: "#1432FF",
    highlightText: "SOLE 2026 ROOKIE SENSATION 🇬🇧",
    achievements: [
      "F1 debut with Racing Bulls at just 18 years old",
      "Youngest winner in FIA Formula 3 history",
      "British Karting & F4 Champion",
      "Red Bull Junior Team core star"
    ]
  },
  alonso: {
    wins: 32,
    podiums: 106,
    championships: 2,
    statsLabel: "Wins: 32 | Podiums: 106 | World Titles: 2 | Poles: 22",
    videoUrl: "/alonso.mp4",
    start: 0,
    fontFamily: "'Cormorant Garamond', serif",
    themeColor: "#006F62",
    highlightText: "THE EL PLAN LEGEND 🇪🇸",
    achievements: [
      "Double F1 World Champion (2005, 2006)",
      "32 Grand Prix Wins & 106 Podiums",
      "Oldest driver to race in 400+ Grands Prix",
      "WEC World Champion & 24 Hours of Le Mans Winner"
    ]
  },
  stroll: {
    wins: 0,
    podiums: 3,
    championships: 0,
    statsLabel: "Wins: 0 | Podiums: 3 | Poles: 1",
    videoUrl: "/stroll.mp4",
    start: 0,
    fontFamily: "'Cormorant Garamond', serif",
    themeColor: "#006F62",
    highlightText: "TURKISH POLE POSITION MASTER 🇨🇦",
    achievements: [
      "Pole Position in rain-soaked Turkey 2020",
      "Youngest driver to start on the front row (Monza 2017)",
      "Three-time podium finisher (Baku, Monza, Sakhir)",
      "Aston Martin F1 core team pillar"
    ]
  },
  ocon: {
    wins: 1,
    podiums: 3,
    championships: 0,
    statsLabel: "Wins: 1 | Podiums: 3",
    videoUrl: "m2r-2ALNWIU",
    start: 0,
    fontFamily: "'Russo One', sans-serif",
    themeColor: "#B6BABD",
    highlightText: "MONACO PODIUM & HUNGARY WINNER 🇫🇷",
    achievements: [
      "2021 Hungarian Grand Prix Winner",
      "Lead Haas Driver for the 2026 Regulation Era",
      "Stunning P3 finish in Monaco (2023)",
      "GP3 Champion & Mercedes academy graduate"
    ]
  },
  bearman: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "F1 Rookie Points | Team: Haas",
    videoUrl: "/ollie.mp4",
    start: 0,
    fontFamily: "'Russo One', sans-serif",
    themeColor: "#B6BABD",
    highlightText: "SAUDI ARABIA HEROIC POINTS 🇬🇧",
    achievements: [
      "Subbed for Ferrari at Jeddah 2024 (P7 finish, youngest ever Ferrari driver)",
      "Haas F1 Team full-time seat for 2026",
      "Formula 2 Sprint & Feature Race Winner",
      "Scuderia Ferrari Driver Academy member"
    ]
  },
  hulkenberg: {
    wins: 0,
    podiums: 1,
    championships: 0,
    statsLabel: "Wins: 0 | Podiums: 1 | Poles: 1",
    videoUrl: "/hulk.mp4",
    start: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    themeColor: "#A3A3A3",
    highlightText: "AUDI WORKSTEAM COMMANDER 🇩🇪",
    achievements: [
      "Lead Audi driver for their historic 2026 entry",
      "2010 Brazilian Grand Prix Pole Sitter",
      "2015 24 Hours of Le Mans Champion (Porsche)",
      "Over 220 F1 race starts with unmatched consistency"
    ]
  },
  bortoleto: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "F2 Champion | Audi Debutant",
    videoUrl: "gabi.mp4",
    start: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    themeColor: "#A3A3A3",
    highlightText: "BRAZIL'S NEXT CHAMPIONSHIP PRODIGY 🇧🇷",
    achievements: [
      "Audi F1 Team Driver for 2026 debut",
      "2024 FIA Formula 2 Championship Winner",
      "2023 FIA Formula 3 Championship Winner (Rookie Season)",
      "Managed by Fernando Alonso's A14 agency"
    ]
  },
  gasly: {
    wins: 1,
    podiums: 4,
    championships: 0,
    statsLabel: "Wins: 1 | Podiums: 4",
    videoUrl: "/gasly.mp4",
    start: 0,
    fontFamily: "'Exo 2', sans-serif",
    themeColor: "#0090FF",
    highlightText: "MONZA GLORY & ALPINE HERO 🇫🇷",
    achievements: [
      "2020 Italian Grand Prix Winner (AlphaTauri Monza)",
      "Alpine F1 Team Lead Driver",
      "Podium Finishes in Brazil, Baku, and Zandvoort",
      "GP2 Series Champion"
    ]
  },
  colapinto: {
    wins: 0,
    podiums: 0,
    championships: 0,
    statsLabel: "Baku Points Finisher | Team: Alpine",
    videoUrl: "/colapinto.mp4",
    start: 0,
    fontFamily: "'Exo 2', sans-serif",
    themeColor: "#FF90FF",
    highlightText: "ARGENTINA'S F1 SENSATION 🇦🇷",
    achievements: [
      "Signed to Alpine F1 Team for the 2026 season",
      "Sensational points finish in Baku on Williams debut",
      "South American racing phenomenon",
      "Formula 3 and Formula 2 Race Winner"
    ]
  },
  bottas: {
    wins: 10,
    podiums: 67,
    championships: 0,
    statsLabel: "Wins: 10 | Podiums: 67 | Poles: 20",
    videoUrl: "/bottas.mp4",
    start: 0,
    fontFamily: "'Syne', sans-serif",
    themeColor: "#1E1E24",
    highlightText: "CADILLAC LEAD VETERAN 🇫🇮",
    achievements: [
      "10-Time Grand Prix Winner (Mercedes AMG F1)",
      "67 Career Podiums & 20 Pole Positions",
      "Cadillac F1 Team Lead Driver for 2026",
      "Unmatched qualifying streak inside top 10"
    ]
  },
  perez: {
    wins: 6,
    podiums: 39,
    championships: 0,
    statsLabel: "Wins: 6 | Podiums: 39 | Poles: 3",
    videoUrl: "/perez.mp4",
    start: 0,
    fontFamily: "'Syne', sans-serif",
    themeColor: "#1E1E24",
    highlightText: "MINISTER OF DEFENSE & STREET KING 🇲🇽",
    achievements: [
      "6-Time F1 Grand Prix Winner",
      "Street circuit specialist (Baku, Monaco, Singapore Wins)",
      "Cadillac F1 Team driver for 2026",
      "Legendary defense helper in Red Bull titles"
    ]
  }
};
