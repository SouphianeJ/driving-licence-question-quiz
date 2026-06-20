"use client";

import { TOTAL_QUESTIONS } from "@/lib/questions";
import { useProgress } from "@/lib/storage";
import { ButtonLink, Button, Card, ProgressBar } from "./ui";
import { ChartIcon } from "./icons";

export function ProgressionClient() {
  const { state, hydrated, reset } = useProgress();

  if (!hydrated) {
    return <p className="text-slate-500">Chargement de votre progression…</p>;
  }

  const values = Object.values(state.cards);
  const acquises = values.filter((s) => s === "acquise").length;
  const aRevoir = values.filter((s) => s === "a_revoir").length;
  const restantes = TOTAL_QUESTIONS - acquises - aRevoir;
  const hasData = values.length > 0 || state.exams.length > 0;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Maîtrise des fiches
          </h2>
          <span className="text-sm text-slate-500">
            {acquises} / {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="mt-4">
          <ProgressBar value={acquises} max={TOTAL_QUESTIONS} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <Metric value={acquises} label="Acquises" tone="text-emerald-600" />
          <Metric value={aRevoir} label="À revoir" tone="text-amber-600" />
          <Metric value={restantes} label="Non vues" tone="text-slate-500" />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Historique des examens blancs
        </h2>
        {state.exams.length === 0 ? (
          <div className="mt-6 flex flex-col items-center py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <ChartIcon width={24} height={24} />
            </span>
            <p className="mt-3 text-sm text-slate-500">
              Aucun examen blanc pour l&apos;instant.
            </p>
            <ButtonLink href="/examen" size="sm" className="mt-4">
              Lancer un examen blanc
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {state.exams.map((exam, i) => {
              const pct = Math.round((exam.correct / exam.total) * 100);
              return (
                <li key={i} className="flex items-center justify-between py-3">
                  <span className="text-sm text-slate-600">
                    {new Date(exam.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-sm text-slate-500">
                    {exam.correct}/{exam.total}
                  </span>
                  <span
                    className={
                      pct >= 70
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-amber-600"
                    }
                  >
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {hasData && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  "Réinitialiser toute votre progression ? Cette action est irréversible."
                )
              ) {
                reset();
              }
            }}
          >
            Réinitialiser ma progression
          </Button>
        </div>
      )}
    </div>
  );
}

function Metric({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <div>
      <p className={`text-3xl font-extrabold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}
