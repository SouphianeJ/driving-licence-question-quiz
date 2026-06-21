import Link from "next/link";
import { product } from "@/config/brand";
import { listTenants } from "@/lib/server/store";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AppFooter } from "@/components/AppFooter";
import { buildPalette } from "@/lib/color";
import { ArrowRightIcon, CarIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const tenants = listTenants();

  return (
    <>
      <GlobalHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand-50 to-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700">
              <CarIcon width={16} height={16} />
              Permis B · Interrogation orale
            </span>
            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {product.tagline}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
              Choisissez votre auto-école pour accéder à votre espace
              d&apos;entraînement.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Sélectionnez votre auto-école
          </h2>

          {tenants.length === 0 ? (
            <p className="mt-8 text-center text-slate-500">
              Aucune auto-école n&apos;est encore configurée.
            </p>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {tenants.map((t) => {
                const palette = buildPalette(t.color);
                return (
                  <li key={t.slug}>
                    <Link
                      href={`/t/${t.slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white"
                        style={{ backgroundColor: `rgb(${palette[600]})` }}
                      >
                        {t.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.logoUrl} alt={t.name} className="h-full w-full object-contain" />
                        ) : (
                          <CarIcon width={24} height={24} />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold text-slate-900">
                          {t.name}
                        </span>
                        <span className="block text-sm text-slate-500">
                          /t/{t.slug}
                        </span>
                      </span>
                      <ArrowRightIcon
                        width={20}
                        height={20}
                        className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-12 text-center text-sm text-slate-500">
            Vous gérez une auto-école ?{" "}
            <Link href="/login" className="font-medium text-brand-700 hover:underline">
              Connectez-vous à votre espace d&apos;administration
            </Link>
          </p>
        </section>
      </main>
      <AppFooter />
    </>
  );
}
