import type { Metadata } from "next";
import { ProgressionClient } from "@/components/ProgressionClient";

export const metadata: Metadata = {
  title: "Ma progression",
  description:
    "Suivez votre maîtrise des fiches et l'historique de vos examens blancs.",
};

export default function ProgressionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ma progression</h1>
        <p className="mt-2 text-slate-600">
          Vos données restent sur cet appareil, sans création de compte.
        </p>
      </header>
      <ProgressionClient />
    </div>
  );
}
