/**
 * Modèle de données de l'interrogation orale du permis B.
 *
 * Lors de l'examen, l'inspecteur tire une fiche numérotée. Chaque fiche
 * comporte trois volets : une vérification technique (intérieure ou
 * extérieure), une question de sécurité routière et une question de
 * premiers secours.
 */

export type VerificationPosition = "Intérieure" | "Extérieure";

export type Theme = "verification" | "securite" | "premiers_secours";

export interface SubQuestion {
  question: string;
  answer: string;
}

export interface VerificationQuestion extends SubQuestion {
  position: VerificationPosition;
}

export interface Question {
  number: number;
  verification: VerificationQuestion;
  securite: SubQuestion;
  premiers_secours: SubQuestion;
}

/** Libellés affichés pour chaque volet d'une fiche. */
export const THEME_LABELS: Record<Theme, string> = {
  verification: "Vérification",
  securite: "Sécurité routière",
  premiers_secours: "Premiers secours",
};

/** Ordre d'affichage canonique des volets. */
export const THEME_ORDER: Theme[] = [
  "verification",
  "securite",
  "premiers_secours",
];

export function getSubQuestion(question: Question, theme: Theme): SubQuestion {
  return question[theme];
}
