"use client";

import { logoutAction } from "@/lib/server/actions";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={
          className ??
          "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        }
      >
        Déconnexion
      </button>
    </form>
  );
}
