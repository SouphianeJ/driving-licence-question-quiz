import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { hashPassword, newId } from "./crypto";
import type { StoreData, Tenant, User } from "./types";

/**
 * Persistance fichier (JSON) derrière une API simple.
 *
 * Cette couche est volontairement isolée : remplacer le contenu de ce module
 * par un véritable SGBD (MongoDB, Postgres…) ne demande aucune modification du
 * reste de l'application. Aucune dépendance externe n'est requise.
 */

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), ".data");
const STORE_PATH = join(DATA_DIR, "store.json");

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

function seed(): StoreData {
  const superEmail = process.env.SUPERADMIN_EMAIL || "superadmin@permis-oral.fr";
  const superPassword = process.env.SUPERADMIN_PASSWORD || "superadmin";
  const now = new Date().toISOString();

  const mkUser = (
    email: string,
    password: string,
    role: User["role"],
    tenantSlug: string | null
  ): User => {
    const { hash, salt } = hashPassword(password);
    return {
      id: newId(),
      email: email.toLowerCase(),
      passwordHash: hash,
      salt,
      role,
      tenantSlug,
      createdAt: now,
    };
  };

  // Tenant de démonstration + comptes, pour une prise en main immédiate.
  const demo: Tenant = {
    slug: "demo",
    name: "Auto-École Démo",
    color: "#0ea5e9",
    logoUrl: "",
    createdAt: now,
  };

  return {
    tenants: [demo],
    users: [
      mkUser(superEmail, superPassword, "superadmin", null),
      mkUser("admin@demo.fr", "admin", "admin", "demo"),
      mkUser("eleve@demo.fr", "eleve", "student", "demo"),
    ],
  };
}

function read(): StoreData {
  if (!existsSync(STORE_PATH)) {
    const data = seed();
    write(data);
    return data;
  }
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8")) as StoreData;
    return {
      tenants: parsed.tenants ?? [],
      users: parsed.users ?? [],
    };
  } catch {
    const data = seed();
    write(data);
    return data;
  }
}

function write(data: StoreData): void {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

// ---- Tenants ----

export function listTenants(): Tenant[] {
  return read().tenants.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function getTenant(slug: string): Tenant | undefined {
  return read().tenants.find((t) => t.slug === slug);
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export function createTenant(input: {
  slug: string;
  name: string;
  color?: string;
  logoUrl?: string;
}): Tenant {
  const data = read();
  const slug = input.slug.trim().toLowerCase();
  if (!isValidSlug(slug)) {
    throw new Error("Identifiant invalide (lettres minuscules, chiffres, tirets).");
  }
  if (data.tenants.some((t) => t.slug === slug)) {
    throw new Error("Cet identifiant de tenant existe déjà.");
  }
  const tenant: Tenant = {
    slug,
    name: input.name.trim(),
    color: input.color?.trim() || "#4f46e5",
    logoUrl: input.logoUrl?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  data.tenants.push(tenant);
  write(data);
  return tenant;
}

export function updateTenantBranding(
  slug: string,
  patch: { name?: string; color?: string; logoUrl?: string }
): Tenant {
  const data = read();
  const tenant = data.tenants.find((t) => t.slug === slug);
  if (!tenant) throw new Error("Tenant introuvable.");
  if (patch.name !== undefined) tenant.name = patch.name.trim() || tenant.name;
  if (patch.color !== undefined) tenant.color = patch.color.trim() || tenant.color;
  if (patch.logoUrl !== undefined) tenant.logoUrl = patch.logoUrl.trim();
  write(data);
  return tenant;
}

// ---- Utilisateurs ----

export function getUserById(id: string): User | undefined {
  return read().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return read().users.find((u) => u.email === email.toLowerCase());
}

export function listUsers(tenantSlug?: string): User[] {
  const users = read().users;
  const filtered =
    tenantSlug === undefined ? users : users.filter((u) => u.tenantSlug === tenantSlug);
  return filtered.slice().sort((a, b) => a.email.localeCompare(b.email));
}

export function createUser(input: {
  email: string;
  password: string;
  role: User["role"];
  tenantSlug: string | null;
}): User {
  const data = read();
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Adresse e-mail invalide.");
  }
  if (input.password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }
  if (data.users.some((u) => u.email === email)) {
    throw new Error("Un compte existe déjà avec cette adresse e-mail.");
  }
  if (input.role !== "superadmin" && !input.tenantSlug) {
    throw new Error("Un tenant est requis pour ce rôle.");
  }
  if (input.tenantSlug && !data.tenants.some((t) => t.slug === input.tenantSlug)) {
    throw new Error("Tenant introuvable.");
  }
  const { hash, salt } = hashPassword(input.password);
  const user: User = {
    id: newId(),
    email,
    passwordHash: hash,
    salt,
    role: input.role,
    tenantSlug: input.role === "superadmin" ? null : input.tenantSlug,
    createdAt: new Date().toISOString(),
  };
  data.users.push(user);
  write(data);
  return user;
}

export function deleteUser(id: string): void {
  const data = read();
  data.users = data.users.filter((u) => u.id !== id);
  write(data);
}
