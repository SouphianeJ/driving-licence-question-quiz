import { product } from "@/config/brand";

/** Pied de page neutre, réutilisé en contexte global et tenant. */
export function AppFooter({ name }: { name?: string }) {
  const display = name || product.name;
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-slate-400">
        © {year} {display}. Propulsé par {product.name} — outil pédagogique,
        contenu indicatif, non affilié à l&apos;administration.
      </div>
    </footer>
  );
}
