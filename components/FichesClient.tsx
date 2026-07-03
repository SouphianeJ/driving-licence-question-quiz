"use client";

import { useMemo, useState } from "react";
import type { Question, VerificationPosition } from "@/lib/types";
import { THEME_LABELS, THEME_ORDER } from "@/lib/types";
import { filterByPosition } from "@/lib/questions";
import { PositionBadge, ThemeBadge, cn } from "./ui";

type PositionFilter = VerificationPosition | "all";

const FILTERS: Array<{ value: PositionFilter; label: string }> = [
  { value: "all", label: "Toutes" },
  { value: "Intérieure", label: "Intérieures" },
  { value: "Extérieure", label: "Extérieures" },
];

function matches(q: Question, term: string): boolean {
  if (!term) return true;
  const haystack = [
    String(q.number),
    q.verification.question,
    q.verification.answer,
    q.securite.question,
    q.securite.answer,
    q.premiers_secours.question,
    q.premiers_secours.answer,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}

export function FichesClient({ questions }: { questions: Question[] }) {
  const [term, setTerm] = useState("");
  const [position, setPosition] = useState<PositionFilter>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const results = useMemo(
    () => filterByPosition(questions, position).filter((q) => matches(q, term)),
    [questions, position, term]
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Rechercher dans les fiches…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 sm:max-w-xs"
        />
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
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {results.length} fiche{results.length > 1 ? "s" : ""}
      </p>

      <ul className="mt-3 space-y-3">
        {results.map((q) => {
          const open = openId === q.number;
          return (
            <li
              key={q.number}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <button
                onClick={() => setOpenId(open ? null : q.number)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50"
                aria-expanded={open}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                    {q.number}
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {q.verification.question}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <PositionBadge position={q.verification.position} />
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={cn(
                      "text-slate-400 transition-transform",
                      open && "rotate-180"
                    )}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              {open && (
                <div className="space-y-4 border-t border-slate-100 bg-slate-50 px-5 py-5">
                  {THEME_ORDER.map((theme) => (
                    <div key={theme}>
                      <ThemeBadge theme={theme} />
                      <p className="mt-2 text-sm font-medium text-slate-800">
                        {q[theme].question}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {q[theme].answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {results.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          Aucune fiche ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
