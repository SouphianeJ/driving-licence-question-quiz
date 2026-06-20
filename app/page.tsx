import { brand } from "@/config/brand";
import { QUESTIONS, TOTAL_QUESTIONS, filterByPosition } from "@/lib/questions";
import { ButtonLink, Card } from "@/components/ui";
import {
  ArrowRightIcon,
  BookIcon,
  CarIcon,
  ChartIcon,
  HeartPulseIcon,
  ShieldIcon,
  ShuffleIcon,
} from "@/components/icons";

const FEATURES = [
  {
    icon: CarIcon,
    title: "Vérifications du véhicule",
    text: "Commandes intérieures et éléments extérieurs : l'élève apprend à les localiser et à les expliquer.",
  },
  {
    icon: ShieldIcon,
    title: "Sécurité routière",
    text: "Les bons réflexes et les justifications attendues par l'inspecteur, fiche par fiche.",
  },
  {
    icon: HeartPulseIcon,
    title: "Premiers secours",
    text: "Les gestes qui sauvent et les conduites à tenir face à un accident de la route.",
  },
];

const BENEFITS = [
  {
    icon: BookIcon,
    title: "Mode révision",
    text: "Parcours libre des fiches avec réponses masquées et suivi « acquise / à revoir ».",
  },
  {
    icon: ShuffleIcon,
    title: "Examen blanc",
    text: "Tirage aléatoire comme le jour J, auto-évaluation et score détaillé par thème.",
  },
  {
    icon: ChartIcon,
    title: "Progression",
    text: "Chaque élève visualise sa progression, conservée localement sur son appareil.",
  },
];

export default function HomePage() {
  const interieures = filterByPosition(QUESTIONS, "Intérieure").length;
  const exterieures = filterByPosition(QUESTIONS, "Extérieure").length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700">
            <CarIcon width={16} height={16} />
            Permis B · Interrogation orale
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {brand.tagline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {TOTAL_QUESTIONS} fiches officielles pour préparer la partie orale de
            l&apos;épreuve pratique : vérifications, sécurité routière et premiers
            secours. Conçu pour les auto-écoles et leurs élèves.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/reviser" size="lg">
              Commencer à réviser
              <ArrowRightIcon width={18} height={18} />
            </ButtonLink>
            <ButtonLink href="/examen" size="lg" variant="secondary">
              Lancer un examen blanc
            </ButtonLink>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value={TOTAL_QUESTIONS} label="Fiches" />
            <Stat value={interieures} label="Vérif. intérieures" />
            <Stat value={exterieures} label="Vérif. extérieures" />
            <Stat value={3} label="Thèmes" />
          </dl>
        </div>
      </section>

      {/* Thèmes couverts */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Tout le programme de l&apos;oral
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Chaque fiche reprend la structure exacte de l&apos;épreuve : une
          vérification, une question de sécurité et une question de premiers
          secours.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon width={24} height={24} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Modes d'entraînement */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Deux façons de s&apos;entraîner
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon width={24} height={24} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour les auto-écoles */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Card className="overflow-hidden">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Une solution pour votre auto-école
              </h2>
              <p className="mt-4 text-slate-600">
                Proposez à vos élèves un outil d&apos;entraînement moderne, à votre
                image. Nom, couleurs et coordonnées sont personnalisables en
                marque blanche, sans développement.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {[
                  "Personnalisation aux couleurs de l'école",
                  "Aucune installation pour l'élève (web et mobile)",
                  "Données de progression stockées sur l'appareil (RGPD)",
                  "Contenu basé sur les fiches officielles du permis B",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href={`mailto:${brand.contactEmail}`} variant="primary">
                  Demander une démo
                  <ArrowRightIcon width={18} height={18} />
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
              <p className="text-sm font-medium uppercase tracking-wide text-brand-100">
                Taux de réussite
              </p>
              <p className="mt-2 text-5xl font-extrabold">+ d&apos;assurance</p>
              <p className="mt-4 text-brand-50">
                Des élèves mieux préparés à l&apos;oral, des inspecteurs face à des
                candidats qui maîtrisent leur véhicule et les bons réflexes.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
      <dd className="text-3xl font-extrabold text-brand-700">{value}</dd>
      <dt className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
    </div>
  );
}
