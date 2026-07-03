"use client";

import type { ReactNode } from "react";
import type { SubQuestion, Theme, VerificationPosition } from "@/lib/types";
import { EyeIcon } from "./icons";
import { Button, PositionBadge, ThemeBadge, cn } from "./ui";

interface QuestionPanelProps {
  theme: Theme;
  data: SubQuestion;
  position?: VerificationPosition;
  revealed: boolean;
  onToggle: () => void;
  /** Contenu additionnel sous la réponse (ex. auto-évaluation). */
  footer?: ReactNode;
}

export function QuestionPanel({
  theme,
  data,
  position,
  revealed,
  onToggle,
  footer,
}: QuestionPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ThemeBadge theme={theme} />
        {position && <PositionBadge position={position} />}
      </div>

      <p className="text-base font-medium text-slate-800">{data.question}</p>

      <div className="mt-4">
        {revealed ? (
          <div
            className={cn(
              "rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900",
              "animate-fade-in-up"
            )}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Réponse attendue
            </p>
            {data.answer}
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={onToggle}>
            <EyeIcon width={16} height={16} />
            Afficher la réponse
          </Button>
        )}
      </div>

      {revealed && footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
