"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persistance locale de la progression de l'élève (sans compte ni serveur).
 * Les données restent sur l'appareil — adapté au RGPD et au mode hors-ligne.
 */

const STORAGE_KEY = "permis-oral:progress:v1";

export type CardStatus = "acquise" | "a_revoir";

export interface ExamRecord {
  date: string;
  total: number;
  correct: number;
}

export interface ProgressState {
  /** Statut de révision par numéro de fiche. */
  cards: Record<number, CardStatus>;
  /** Historique des examens blancs (le plus récent en premier). */
  exams: ExamRecord[];
}

const EMPTY: ProgressState = { cards: {}, exams: [] };

function read(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      cards: parsed.cards ?? {},
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
    };
  } catch {
    return EMPTY;
  }
}

function write(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota dépassé ou stockage indisponible : on ignore silencieusement */
  }
}

/** Hook React exposant la progression et ses mutations. */
export function useProgress() {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  const update = useCallback((next: ProgressState) => {
    setState(next);
    write(next);
  }, []);

  const setCardStatus = useCallback(
    (number: number, status: CardStatus | null) => {
      setState((prev) => {
        const cards = { ...prev.cards };
        if (status === null) {
          delete cards[number];
        } else {
          cards[number] = status;
        }
        const next = { ...prev, cards };
        write(next);
        return next;
      });
    },
    []
  );

  const addExam = useCallback((record: ExamRecord) => {
    setState((prev) => {
      const next = { ...prev, exams: [record, ...prev.exams].slice(0, 20) };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => update(EMPTY), [update]);

  return { state, hydrated, setCardStatus, addExam, reset };
}
