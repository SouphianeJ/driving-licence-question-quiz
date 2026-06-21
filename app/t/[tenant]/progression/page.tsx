import type { Metadata } from "next";
import { ProgressionClient } from "@/components/ProgressionClient";

export const metadata: Metadata = { title: "Ma progression" };

export default function ProgressionPage({ params }: { params: { tenant: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ma progression</h1>
        <p className="mt-2 text-slate-600">
          Vos données restent sur cet appareil, sans création de compte.
        </p>
      </header>
      <ProgressionClient namespace={params.tenant} />
    </div>
  );
}
