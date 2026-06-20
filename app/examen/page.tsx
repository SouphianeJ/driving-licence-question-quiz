import type { Metadata } from "next";
import { QUESTIONS } from "@/lib/questions";
import { ExamenClient } from "@/components/ExamenClient";

export const metadata: Metadata = {
  title: "Examen blanc",
  description:
    "Simulez l'interrogation orale du permis B : tirage aléatoire, auto-évaluation et score détaillé par thème.",
};

export default function ExamenPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Examen blanc</h1>
        <p className="mt-2 text-slate-600">
          Mettez-vous en condition réelle et mesurez votre niveau.
        </p>
      </header>
      <ExamenClient questions={QUESTIONS} />
    </div>
  );
}
