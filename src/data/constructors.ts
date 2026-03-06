/**
 * All 11 F1 constructors. Ordered expensive → cheap: McLaren, Mercedes, Ferrari, Red Bull,
 * Williams, Racing Bulls, Aston Martin, Haas, Audi, Alpine, Cadillac.
 */
export type Constructor = {
  id: string;
  name: string;
  price: number;
};

export const CONSTRUCTOR_BUDGET = 50;

export const constructors: Constructor[] = [
  // Top 4 – any pair of these exceeds the ₹50M constructor budget
  { id: "mclaren", name: "McLaren", price: 30 },
  { id: "mercedes", name: "Mercedes", price: 28 },
  { id: "ferrari", name: "Ferrari", price: 27 },
  { id: "red_bull", name: "Red Bull", price: 26 },

  // Remaining – can be combined with at most one of the top 4 within budget
  { id: "williams", name: "Williams", price: 20 },
  { id: "rb", name: "RB F1 Team", price: 18 },
  { id: "aston_martin", name: "Aston Martin", price: 16 },
  { id: "haas", name: "Haas F1 Team", price: 14 },
  { id: "audi", name: "Audi", price: 12 },
  { id: "alpine", name: "Alpine", price: 10 },
  { id: "cadillac", name: "Cadillac F1 Team", price: 8 },
];

export function getConstructors(): Constructor[] {
  return constructors;
}
