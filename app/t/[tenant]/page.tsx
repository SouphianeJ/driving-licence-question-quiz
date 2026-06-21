import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenant } from "@/lib/server/store";
import { TOTAL_QUESTIONS, QUESTIONS, filterByPosition } from "@/lib/questions";
import { Card } from "@/components/ui";
import {
  ArrowRightIcon,
  BookIcon,
  ChartIcon,
  ShuffleIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const MODES = [
  {
    href: "reviser",
    icon: BookIcon,
    title: "Réviser",
    text: "Parcourez les fiches avec réponses masquées et suivez vos acquis.",
  },
  {
    href: "examen",
    icon: ShuffleIcon,
    title: "Examen blanc",
    text: "Mettez-vous en condition réelle et obtenez un score par thème.",
  },
  {
    href: "fiches",
    icon: BookIcon,
    title: "Toutes les fiches",
    text: "Consultez et recherchez l'intégralité des fiches officielles.",
  },
  {
    href: "progression",
    icon: ChartIcon,
    title: "Ma progression",
    text: "Visualisez votre maîtrise et l'historique de vos examens.",
  },
];

export default async function TenantHome({ params }: { params: { tenant: string } }) {
  const tenant = await getTenant(params.tenant);
  if (!tenant) notFound();

  const interieures = filterByPosition(QUESTIONS, "Intérieure").length;
  const exterieures = filterByPosition(QUESTIONS, "Extérieure").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-white sm:px-10">
        <h1 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Préparez l&apos;interrogation orale du permis B
        </h1>
        <p className="mt-3 max-w-xl text-brand-50">
          {TOTAL_QUESTIONS} fiches officielles : vérifications, sécurité routière
          et premiers secours. Entraînez-vous avec {tenant.name}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/t/${tenant.slug}/reviser`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Commencer à réviser
            <ArrowRightIcon width={18} height={18} />
          </Link>
          <Link
            href={`/t/${tenant.slug}/examen`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500/30 px-5 py-3 font-medium text-white ring-1 ring-inset ring-white/40 hover:bg-brand-500/50"
          >
            Examen blanc
          </Link>
        </div>
      </section>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={TOTAL_QUESTIONS} label="Fiches" />
        <Stat value={interieures} label="Vérif. intérieures" />
        <Stat value={exterieures} label="Vérif. extérieures" />
        <Stat value={3} label="Thèmes" />
      </dl>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {MODES.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={`/t/${tenant.slug}/${href}`}>
            <Card className="h-full p-6 transition-colors hover:border-brand-300 hover:bg-brand-50/40">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon width={24} height={24} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center">
      <dd className="text-3xl font-extrabold text-brand-700">{value}</dd>
      <dt className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
    </div>
  );
}
