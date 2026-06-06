/**
 * All 11 F1 constructors. Ordered expensive → cheap: McLaren, Mercedes, Ferrari, Red Bull,
 * Williams, Racing Bulls, Aston Martin, Haas, Audi, Alpine, Cadillac.
 */
export type Constructor = {
  id: string;
  name: string;
  price: number;
  teamColor: string;
  liveryUrl?: string;
};

export const CONSTRUCTOR_BUDGET = 50;

export const constructors: Constructor[] = [
  // Top 4 – any pair of these exceeds the ₹50M constructor budget
  { id: "mclaren", name: "McLaren", price: 30, teamColor: "#FF8700", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp" },
  { id: "mercedes", name: "Mercedes", price: 28, teamColor: "#00D2BE", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp" },
  { id: "ferrari", name: "Ferrari", price: 27, teamColor: "#DC0000", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp" },
  { id: "red_bull", name: "Red Bull", price: 26, teamColor: "#0600EF", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracingcarright.webp" },

  // Remaining – can be combined with at most one of the top 4 within budget
  { id: "williams", name: "Williams", price: 20, teamColor: "#005AFF", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/williams/2026williamscarright.webp" },
  { id: "rb", name: "RB F1 Team", price: 18, teamColor: "#1432FF", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullscarright.webp" },
  { id: "aston_martin", name: "Aston Martin", price: 16, teamColor: "#006F62", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartincarright.webp" },
  { id: "haas", name: "Haas F1 Team", price: 14, teamColor: "#B6BABD", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamcarright.webp" },
  { id: "audi", name: "Audi", price: 12, teamColor: "#A3A3A3", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/audi/2026audicarright.webp" },
  { id: "alpine", name: "Alpine", price: 10, teamColor: "#0090FF", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/alpine/2026alpinecarright.webp" },
  { id: "cadillac", name: "Cadillac F1 Team", price: 8, teamColor: "#1E1E24", liveryUrl: "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaccarright.webp" },
];

export function getConstructors(): Constructor[] {
  return constructors;
}
