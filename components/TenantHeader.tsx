"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { PublicUser } from "@/lib/server/types";
import { CarIcon } from "./icons";
import { LogoutButton } from "./LogoutButton";
import { cn } from "./ui";

interface TenantHeaderProps {
  slug: string;
  name: string;
  logoUrl: string;
  user: PublicUser;
}

export function TenantHeader({ slug, name, logoUrl, user }: TenantHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const base = `/t/${slug}`;
  const nav = [
    { href: `${base}/reviser`, label: "Réviser" },
    { href: `${base}/examen`, label: "Examen blanc" },
    { href: `${base}/fiches`, label: "Fiches" },
    { href: `${base}/progression`, label: "Progression" },
  ];
  if (user.role === "admin" || user.role === "superadmin") {
    nav.push({ href: `${base}/settings`, label: "Réglages" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={base}
          className="flex items-center gap-2 font-bold text-slate-900"
          onClick={() => setOpen(false)}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} className="h-9 w-9 rounded-xl object-contain" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <CarIcon width={20} height={20} />
            </span>
          )}
          <span className="leading-tight">{name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <LogoutButton />
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-3 text-sm font-medium",
                pathname === item.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 px-2 py-1">
            <LogoutButton className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50" />
          </div>
        </nav>
      )}
    </header>
  );
}
