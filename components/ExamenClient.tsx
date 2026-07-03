"use client";

import { useCallback, useMemo, useState } from "react";
import type { Question, Theme } from "@/lib/types";
import { THEME_LABELS, THEME_ORDER } from "@/lib/types";
import { drawRandom } from "@/lib/questions";
import { useProgress } from "@/lib/storage";
import {
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  RotateIcon,
  ShieldIcon,
} from "./icons";
import { Button, Card, ProgressBar, ThemeBadge, PositionBadge, cn } from "./ui";

type Phase = "setup" | "running" | "done";
type Verdict = Record<Theme, boolean | null>;

const SIZES = [3, 5, 10];

function emptyVerdict(): Verdict {
  return { verification: null, securite: null, premiers_secours: null };
}

export function ExamenClient({
  questions,
  namespace,
}: {
  questions: Question[];
  namespace: string;
}) {
  const { addExam } = useProgress(namespace);
  const [phase, setPhase] = useState<Phase>("setup");
  const [count, setCount] = useState(5);
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);

  const start = useCallback(() => {
    setDeck(drawRandom(count, questions));
    setVerdicts(Array.from({ length: count }, emptyVerdict));
    setIndex(0);
    setRevealed(false);
    setPhase("running");
  }, [count, questions]);

  const current = deck[index];

  const setVerdict = (theme: Theme, value: boolean) => {
    setVerdicts((prev) => {
      const next = prev.slice();
      next[index] = { ...next[index], [theme]: value };
      return next;
    });
  };

  const next = useCallback(() => {
    if (index + 1 < deck.length) {
      setIndex((i) => i + 1);
      setRevealed(false);
    } else {
      const correct = verdicts.reduce(
        (sum, v) => sum + THEME_ORDER.filter((t) => v[t] === true).length,
        0
      );
      addExam({
        date: new Date().toISOString(),
        total: deck.length * THEME_ORDER.length,
        correct,
      });
      setPhase("done");
    }
  }, [index, deck.length, verdicts, addExam]);

  const restart = () => setPhase("setup");

  // ---- Écran de configuration ----
  if (phase === "setup") {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <ShieldIcon width={28} height={28} />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Configurer votre examen blanc
        </h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Des fiches sont tirées au hasard. Pour chaque volet, évaluez
          honnêtement votre réponse avant de passer à la suivante.
        </p>

        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Nombre de fiches
          </p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setCount(s)}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-semibold transition-colors",
                  count === s
                    ? "bg-brand-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button size="lg" onClick={start}>
            Démarrer l&apos;examen
            <ArrowRightIcon width={18} height={18} />
          </Button>
        </div>
      </Card>
    );
  }

  // ---- Écran de résultats ----
  if (phase === "done") {
    const totalParts = deck.length * THEME_ORDER.length;
    const correct = verdicts.reduce(
      (sum, v) => sum + THEME_ORDER.filter((t) => v[t] === true).length,
      0
    );
    const pct = Math.round((correct / totalParts) * 100);
    const success = pct >= 70;

    const byTheme = THEME_ORDER.map((theme) => {
      const ok = verdicts.filter((v) => v[theme] === true).length;
      return { theme, ok, total: deck.length };
    });

    return (
      <Card className="p-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Résultat
          </p>
          <p
            className={cn(
              "mt-2 text-6xl font-extrabold",
              success ? "text-emerald-600" : "text-amber-600"
            )}
          >
            {pct}%
          </p>
          <p className="mt-1 text-slate-600">
            {correct} / {totalParts} volets réussis
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
            {success
              ? "Excellent ! Vous êtes prêt·e pour l'oral. Continuez à entretenir vos acquis."
              : "Encore un peu d'entraînement. Reprenez les fiches « à revoir » en mode révision."}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {byTheme.map(({ theme, ok, total }) => (
            <div key={theme}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  {THEME_LABELS[theme]}
                </span>
                <span className="text-slate-500">
                  {ok} / {total}
                </span>
              </div>
              <ProgressBar value={ok} max={total} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={start}>
            <RotateIcon width={18} height={18} />
            Recommencer
          </Button>
          <Button size="lg" variant="secondary" onClick={restart}>
            Modifier les réglages
          </Button>
        </div>
      </Card>
    );
  }

  // ---- Passage de l'examen ----
  if (!current) return null;
  const verdict = verdicts[index];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>
          Fiche {index + 1} / {deck.length}
        </span>
        <span>Fiche officielle n° {current.number}</span>
      </div>
      <ProgressBar value={index + 1} max={deck.length} />

      <div className="mt-6 space-y-4">
        {THEME_ORDER.map((theme) => {
          const data = current[theme];
          const v = verdict[theme];
          return (
            <div key={theme} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <ThemeBadge theme={theme} />
                {theme === "verification" && (
                  <PositionBadge position={current.verification.position} />
                )}
              </div>
              <p className="text-base font-medium text-slate-800">{data.question}</p>

              {revealed && (
                <div className="mt-4 animate-fade-in-up rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Réponse attendue
                  </p>
                  {data.answer}
                </div>
              )}

              {revealed && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Votre réponse :
                  </span>
                  <button
                    onClick={() => setVerdict(theme, true)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      v === true
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    Réussie
                  </button>
                  <button
                    onClick={() => setVerdict(theme, false)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      v === false
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    Manquée
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        {!revealed ? (
          <Button size="lg" onClick={() => setRevealed(true)}>
            <EyeIcon width={18} height={18} />
            Voir la correction
          </Button>
        ) : (
          <Button size="lg" onClick={next}>
            {index + 1 < deck.length ? "Fiche suivante" : "Voir mon résultat"}
            <ArrowRightIcon width={18} height={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
