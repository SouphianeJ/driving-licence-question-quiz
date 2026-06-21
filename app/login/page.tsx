import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { product } from "@/config/brand";
import { defaultLanding, getCurrentUser } from "@/lib/server/auth";
import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui";
import { CarIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const user = getCurrentUser();
  if (user) redirect(searchParams.next || defaultLanding(user));

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-bold text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <CarIcon width={20} height={20} />
          </span>
          {product.name}
        </Link>

        <Card className="p-6">
          <h1 className="text-xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-1 text-sm text-slate-500">
            Accédez à votre espace d&apos;entraînement ou d&apos;administration.
          </p>
          <div className="mt-6">
            <LoginForm next={searchParams.next} />
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-700">
            ← Retour à la sélection d&apos;auto-école
          </Link>
        </p>
      </div>
    </main>
  );
}
