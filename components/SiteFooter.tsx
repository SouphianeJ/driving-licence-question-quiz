import Link from "next/link";
import { brand } from "@/config/brand";
import { TOTAL_QUESTIONS } from "@/lib/questions";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-bold text-slate-900">{brand.name}</p>
          <p className="mt-2 text-sm text-slate-500">{brand.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Entraînement</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href="/reviser" className="hover:text-brand-700">Réviser les fiches</Link></li>
            <li><Link href="/examen" className="hover:text-brand-700">Examen blanc</Link></li>
            <li><Link href="/fiches" className="hover:text-brand-700">Toutes les fiches</Link></li>
            <li><Link href="/progression" className="hover:text-brand-700">Ma progression</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Programme</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>{TOTAL_QUESTIONS} fiches officielles</li>
            <li>Vérifications intérieures &amp; extérieures</li>
            <li>Sécurité routière</li>
            <li>Premiers secours</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <a href={`mailto:${brand.contactEmail}`} className="hover:text-brand-700">
                {brand.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-6 text-center text-xs text-slate-400">
        © {year} {brand.schoolName || brand.name}. Outil pédagogique — contenu indicatif,
        non affilié à l&apos;administration.
      </div>
    </footer>
  );
}
