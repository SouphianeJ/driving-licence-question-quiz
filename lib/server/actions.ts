"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyPassword } from "./crypto";
import {
  clearSessionCookie,
  getCurrentUser,
  setSessionCookie,
  defaultLanding,
} from "./auth";
import {
  createTenant,
  createUser,
  deleteUser,
  getTenant,
  getUserByEmail,
  getUserById,
  updateTenantBranding,
} from "./store";
import type { Role } from "./types";

export interface FormState {
  error?: string;
  success?: string;
}

function fail(message: string): FormState {
  return { error: message };
}

// ---- Authentification ----

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
    return fail("E-mail ou mot de passe incorrect.");
  }

  setSessionCookie(user.id);
  redirect(next && next.startsWith("/") ? next : defaultLanding(user));
}

export async function logoutAction(): Promise<void> {
  clearSessionCookie();
  redirect("/");
}

// ---- Tenants (superadmin) ----

export async function createTenantAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const me = getCurrentUser();
  if (me?.role !== "superadmin") return fail("Action non autorisée.");

  try {
    const tenant = createTenant({
      slug: String(formData.get("slug") || ""),
      name: String(formData.get("name") || ""),
      color: String(formData.get("color") || ""),
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: `Tenant « ${tenant.name} » créé.` };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Erreur lors de la création.");
  }
}

// ---- Comptes ----

export async function createUserAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const me = getCurrentUser();
  if (!me) return fail("Action non autorisée.");

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const requestedRole = String(formData.get("role") || "student") as Role;
  const requestedTenant = String(formData.get("tenantSlug") || "") || null;

  let role: Role = requestedRole;
  let tenantSlug: string | null = requestedTenant;

  if (me.role === "superadmin") {
    // Le superadmin choisit librement rôle et tenant.
    if (role !== "superadmin" && !tenantSlug) return fail("Sélectionnez un tenant.");
  } else if (me.role === "admin") {
    // L'admin ne crée que dans son tenant, et pas de superadmin.
    if (requestedRole === "superadmin") return fail("Action non autorisée.");
    role = requestedRole === "admin" ? "admin" : "student";
    tenantSlug = me.tenantSlug;
  } else {
    return fail("Action non autorisée.");
  }

  try {
    createUser({ email, password, role, tenantSlug });
    if (tenantSlug) revalidatePath(`/t/${tenantSlug}/settings`);
    revalidatePath("/admin");
    return { success: `Compte ${email} créé.` };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Erreur lors de la création.");
  }
}

export async function deleteUserAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const me = getCurrentUser();
  if (!me) return fail("Action non autorisée.");

  const targetId = String(formData.get("userId") || "");
  const target = getUserById(targetId);
  if (!target) return fail("Compte introuvable.");
  if (target.id === me.id) return fail("Vous ne pouvez pas supprimer votre propre compte.");

  if (me.role === "admin") {
    if (target.tenantSlug !== me.tenantSlug || target.role === "superadmin") {
      return fail("Action non autorisée.");
    }
  } else if (me.role !== "superadmin") {
    return fail("Action non autorisée.");
  }

  deleteUser(targetId);
  if (target.tenantSlug) revalidatePath(`/t/${target.tenantSlug}/settings`);
  revalidatePath("/admin");
  return { success: "Compte supprimé." };
}

// ---- Branding du tenant (admin) ----

export async function updateBrandingAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const me = getCurrentUser();
  if (!me) return fail("Action non autorisée.");

  const slug = String(formData.get("slug") || "");
  if (!getTenant(slug)) return fail("Tenant introuvable.");

  const allowed =
    me.role === "superadmin" || (me.role === "admin" && me.tenantSlug === slug);
  if (!allowed) return fail("Action non autorisée.");

  try {
    updateTenantBranding(slug, {
      name: String(formData.get("name") || ""),
      color: String(formData.get("color") || ""),
      logoUrl: String(formData.get("logoUrl") || ""),
    });
    revalidatePath(`/t/${slug}`, "layout");
    revalidatePath(`/t/${slug}/settings`);
    revalidatePath("/");
    return { success: "Personnalisation enregistrée." };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Erreur lors de l'enregistrement.");
  }
}
