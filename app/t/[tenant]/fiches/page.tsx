import type { Metadata } from "next";
import { QUESTIONS } from "@/lib/questions";
import { FichesClient } from "@/components/FichesClient";

export const metadata: Metadata = { title: "Toutes les fiches" };

export default function FichesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Toutes les fiches</h1>
        <p className="mt-2 text-slate-600">
          Recherchez une fiche et dépliez-la pour voir les réponses complètes.
        </p>
      </header>
      <FichesClient questions={QUESTIONS} />
    </div>
  );
}
