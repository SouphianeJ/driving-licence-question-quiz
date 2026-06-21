"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Question, Theme, VerificationPosition } from "@/lib/types";
import { THEME_ORDER } from "@/lib/types";
import { filterByPosition, shuffle } from "@/lib/questions";
import { useProgress } from "@/lib/storage";
import { QuestionPanel } from "./QuestionPanel";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  RotateIcon,
  ShuffleIcon,
} from "./icons";
import { Button, ProgressBar, cn } from "./ui";

type PositionFilter = VerificationPosition | "all";

const FILTERS: Array<{ value: PositionFilter; label: string }> = [
  { value: "all", label: "Toutes" },
  { value: "Intérieure", label: "Intérieures" },
  { value: "Extérieure", label: "Extérieures" },
];

export function ReviserClient({
  questions,
  namespace,
}: {
  questions: Question[];
  namespace: string;
}) {
  const { state, hydrated, setCardStatus } = useProgress(namespace);
  const [position, setPosition] = useState<PositionFilter>("all");
  const [shuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<Theme, boolean>>({
    verification: false,
    securite: false,
    premiers_secours: false,
  });

  const deck = useMemo(() => {
    const filtered = filterByPosition(questions, position);
    return shuffled ? shuffle(filtered) : filtered;
    // On regénère le mélange quand on (dé)active le shuffle ou change de filtre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, position, shuffled]);

  const current = deck[index];

  const resetReveals = useCallback(() => {
    setRevealed({ verification: false, securite: false, premiers_secours: false });
  }, []);

  // Revenir au début et masquer les réponses quand le paquet change.
  useEffect(() => {
    setIndex(0);
    resetReveals();
  }, [deck, resetReveals]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = (i + delta + deck.length) % deck.length;
        return next;
      });
      resetReveals();
    },
    [deck.length, resetReveals]
  );

  // Raccourcis clavier.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " ") {
        e.preventDefault();
        setRevealed({ verification: true, securite: true, premiers_secours: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (deck.length === 0 || !current) {
    return <p className="text-slate-600">Aucune fiche pour ce filtre.</p>;
  }

  const status = state.cards[current.number];
  const acquises = hydrated
    ? deck.filter((q) => state.cards[q.number] === "acquise").length
    : 0;

  return (
    <div>
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPosition(f.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                position === f.value
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Button
          variant={shuffled ? "primary" : "secondary"}
          size="sm"
          onClick={() => setShuffled((s) => !s)}
        >
          <ShuffleIcon width={16} height={16} />
          {shuffled ? "Aléatoire activé" : "Mélanger"}
        </Button>
      </div>

      {/* Progression */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>
            Fiche {index + 1} / {deck.length}
          </span>
          {hydrated && (
            <span className="font-medium text-emerald-700">
              {acquises} acquise{acquises > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <ProgressBar value={index + 1} max={deck.length} />
      </div>

      {/* Carte courante */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Fiche n° {current.number}
          </h2>
          {hydrated && status && (
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                status === "acquise"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              )}
            >
              {status === "acquise" ? "Acquise" : "À revoir"}
            </span>
          )}
        </div>

        <div className="space-y-4">
          {THEME_ORDER.map((theme) => (
            <QuestionPanel
              key={theme}
              theme={theme}
              data={current[theme]}
              position={theme === "verification" ? current.verification.position : undefined}
              revealed={revealed[theme]}
              onToggle={() => setRevealed((r) => ({ ...r, [theme]: !r[theme] }))}
            />
          ))}
        </div>
      </div>

      {/* Auto-suivi */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant={status === "acquise" ? "success" : "secondary"}
          onClick={() =>
            setCardStatus(current.number, status === "acquise" ? null : "acquise")
          }
        >
          <CheckIcon width={16} height={16} />
          Je maîtrise
        </Button>
        <Button
          variant={status === "a_revoir" ? "danger" : "secondary"}
          onClick={() =>
            setCardStatus(current.number, status === "a_revoir" ? null : "a_revoir")
          }
        >
          <RotateIcon width={16} height={16} />
          À revoir
        </Button>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <Button variant="secondary" onClick={() => go(-1)}>
          <ArrowLeftIcon width={18} height={18} />
          Précédente
        </Button>
        <p className="hidden text-xs text-slate-400 sm:block">
          Flèches ← → pour naviguer · Espace pour tout révéler
        </p>
        <Button onClick={() => go(1)}>
          Suivante
          <ArrowRightIcon width={18} height={18} />
        </Button>
      </div>
    </div>
  );
}
