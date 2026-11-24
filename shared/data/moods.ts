export const MOODS = [
  "HAPPY",
  "CALM",
  "SAD",
  "ANGRY",
  "ANXIOUS",
  "EXCITED",
  "TIRED",
  "NEUTRAL",
] as const;

export type Mood = (typeof MOODS)[number];
