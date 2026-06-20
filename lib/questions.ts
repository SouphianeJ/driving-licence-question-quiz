import data from "@/data/questions.json";
import type { Question, VerificationPosition } from "./types";

/**
 * Banque de fiches officielles, triée par numéro.
 * Source unique de vérité importée depuis data/questions.json.
 */
export const QUESTIONS: Question[] = (data as Question[])
  .slice()
  .sort((a, b) => a.number - b.number);

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function getQuestionByNumber(number: number): Question | undefined {
  return QUESTIONS.find((q) => q.number === number);
}

export function filterByPosition(
  questions: Question[],
  position: VerificationPosition | "all"
): Question[] {
  if (position === "all") return questions;
  return questions.filter((q) => q.verification.position === position);
}

/** Mélange de Fisher–Yates (copie, sans mutation de l'entrée). */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Tire `count` fiches distinctes au hasard. */
export function drawRandom(count: number, pool: Question[] = QUESTIONS): Question[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}
