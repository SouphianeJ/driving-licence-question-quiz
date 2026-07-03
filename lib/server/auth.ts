import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession, verifySession } from "./crypto";
import { getUserById } from "./store";
import type { Role, User } from "./types";

export const SESSION_COOKIE = "permis_session";

/** Pose le cookie de session (à appeler depuis une Server Action). */
export function setSessionCookie(userId: string): void {
  cookies().set(SESSION_COOKIE, signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(SESSION_COOKIE);
}

/** Utilisateur courant d'après le cookie de session, ou `null`. */
export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const uid = verifySession(token);
  if (!uid) return null;
  return (await getUserById(uid)) ?? null;
}

/** Exige une session ; redirige vers /login sinon. */
export async function requireUser(nextPath?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  return user;
}

const RANK: Record<Role, number> = { student: 1, admin: 2, superadmin: 3 };

/** Exige au moins le rôle indiqué. */
export async function requireRole(min: Role, nextPath?: string): Promise<User> {
  const user = await requireUser(nextPath);
  if (RANK[user.role] < RANK[min]) redirect("/");
  return user;
}

/**
 * Exige l'accès à un tenant : superadmin (tout) ou membre du tenant.
 * `requireAdmin` impose en plus le rôle admin du tenant.
 */
export async function requireTenantAccess(
  slug: string,
  options: { requireAdmin?: boolean } = {}
): Promise<User> {
  const user = await requireUser(`/t/${slug}`);
  if (user.role === "superadmin") return user;
  if (user.tenantSlug !== slug) redirect("/");
  if (options.requireAdmin && user.role !== "admin") redirect(`/t/${slug}`);
  return user;
}

/** Destination par défaut après connexion, selon le rôle. */
export function defaultLanding(user: User): string {
  if (user.role === "superadmin") return "/admin";
  if (user.role === "admin") return `/t/${user.tenantSlug}/settings`;
  return `/t/${user.tenantSlug}`;
}
