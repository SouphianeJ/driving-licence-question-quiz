import type { Metadata } from "next";
import { QUESTIONS } from "@/lib/questions";
import { ReviserClient } from "@/components/ReviserClient";

export const metadata: Metadata = { title: "Réviser" };

export default function ReviserPage({ params }: { params: { tenant: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Réviser les fiches</h1>
        <p className="mt-2 text-slate-600">
          Lisez chaque énoncé, formulez votre réponse à voix haute, puis vérifiez.
        </p>
      </header>
      <ReviserClient questions={QUESTIONS} namespace={params.tenant} />
    </div>
  );
}
