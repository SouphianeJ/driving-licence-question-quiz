import Link from "next/link";
import { product } from "@/config/brand";
import { defaultLanding, getCurrentUser } from "@/lib/server/auth";
import { CarIcon } from "./icons";
import { LogoutButton } from "./LogoutButton";

/** En-tête des pages globales (hors tenant). */
export function GlobalHeader() {
  const user = getCurrentUser();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <CarIcon width={20} height={20} />
          </span>
          {product.name}
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href={defaultLanding(user)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Mon espace
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
