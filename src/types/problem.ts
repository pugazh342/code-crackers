// src/types/problem.ts
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  order: number;
  description: string;
  videoId?: string;
}