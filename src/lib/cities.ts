export interface CityNode {
  id: string;
  city: string;
  country: string;
  x: number;
  y: number;
  intensity: number;
  agents: number;
  tier: 1 | 2 | 3;
}

// Original repository sample data, shared by the map and the immersive scene.
export const CITIES: CityNode[] = [
  { id: "sf", city: "San Francisco", country: "USA", x: 10, y: 32, intensity: 98, agents: 12470, tier: 1 },
  { id: "ny", city: "New York", country: "USA", x: 24, y: 30, intensity: 92, agents: 9840, tier: 1 },
  { id: "lon", city: "London", country: "UK", x: 46, y: 22, intensity: 88, agents: 7650, tier: 1 },
  { id: "ber", city: "Berlin", country: "Germany", x: 50, y: 20, intensity: 72, agents: 4320, tier: 2 },
  { id: "tko", city: "Tokyo", country: "Japan", x: 84, y: 32, intensity: 85, agents: 6890, tier: 1 },
  { id: "sgp", city: "Singapore", country: "Singapore", x: 74, y: 48, intensity: 76, agents: 5210, tier: 2 },
  { id: "sha", city: "Shanghai", country: "China", x: 78, y: 36, intensity: 90, agents: 8950, tier: 1 },
  { id: "bj", city: "Beijing", country: "China", x: 76, y: 28, intensity: 82, agents: 6430, tier: 1 },
  { id: "blr", city: "Bangalore", country: "India", x: 68, y: 44, intensity: 78, agents: 5980, tier: 2 },
  { id: "syd", city: "Sydney", country: "Australia", x: 88, y: 58, intensity: 45, agents: 2100, tier: 3 },
  { id: "tor", city: "Toronto", country: "Canada", x: 22, y: 26, intensity: 65, agents: 3890, tier: 2 },
  { id: "par", city: "Paris", country: "France", x: 48, y: 24, intensity: 60, agents: 3420, tier: 2 },
  { id: "dub", city: "Dubai", country: "UAE", x: 60, y: 40, intensity: 55, agents: 2890, tier: 2 },
  { id: "sel", city: "Seoul", country: "Korea", x: 82, y: 30, intensity: 70, agents: 4560, tier: 2 },
  { id: "ams", city: "Amsterdam", country: "Netherlands", x: 49, y: 19, intensity: 42, agents: 1870, tier: 3 },
  { id: "sp", city: "São Paulo", country: "Brazil", x: 32, y: 62, intensity: 38, agents: 1520, tier: 3 },
  { id: "nbo", city: "Nairobi", country: "Kenya", x: 56, y: 56, intensity: 30, agents: 890, tier: 3 },
  { id: "tlv", city: "Tel Aviv", country: "Israel", x: 55, y: 38, intensity: 52, agents: 2340, tier: 2 },
  { id: "ist", city: "Istanbul", country: "Turkey", x: 53, y: 30, intensity: 40, agents: 1640, tier: 3 },
  { id: "mex", city: "Mexico City", country: "Mexico", x: 18, y: 44, intensity: 35, agents: 1250, tier: 3 },
];
