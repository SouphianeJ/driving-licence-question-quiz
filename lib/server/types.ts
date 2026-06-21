/** Rôles applicatifs, du plus privilégié au moins privilégié. */
export type Role = "superadmin" | "admin" | "student";

export interface Tenant {
  /** Identifiant utilisé dans l'URL (/t/[slug]). */
  slug: string;
  name: string;
  /** Couleur primaire (hex) — génère la palette de l'interface. */
  color: string;
  /** URL du logo (vide = icône par défaut). */
  logoUrl: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: Role;
  /** Tenant d'appartenance. `null` pour un superadmin (global). */
  tenantSlug: string | null;
  createdAt: string;
}

/** Utilisateur sans données sensibles, sûr à exposer au client. */
export interface PublicUser {
  id: string;
  email: string;
  role: Role;
  tenantSlug: string | null;
}

export interface StoreData {
  tenants: Tenant[];
  users: User[];
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    tenantSlug: user.tenantSlug,
  };
}

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Super-administrateur",
  admin: "Administrateur",
  student: "Élève",
};
