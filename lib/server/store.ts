import { MongoClient, type Db, type Collection } from "mongodb";
import { hashPassword, newId } from "./crypto";
import type { Tenant, User } from "./types";

/**
 * Persistance MongoDB (Atlas) — driver officiel.
 *
 * La connexion est mise en cache au niveau du process (réutilisée entre les
 * requêtes et survit au Hot Reload en développement). Le schéma est garanti
 * par des index uniques ; un seed idempotent crée le superadmin et un tenant
 * de démonstration au premier démarrage.
 */

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "permis_oral";
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

// Cache de connexion partagé (évite l'épuisement du pool en dev / serverless).
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoReady?: Promise<void>;
};

function clientPromise(): Promise<MongoClient> {
  if (!URI) {
    throw new Error(
      "MONGODB_URI n'est pas défini. Renseignez la chaîne de connexion MongoDB Atlas."
    );
  }
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(URI).connect();
  }
  return globalForMongo._mongoClientPromise;
}

async function db(): Promise<Db> {
  return (await clientPromise()).db(DB_NAME);
}

function tenantsCol(database: Db): Collection<Tenant> {
  return database.collection<Tenant>("tenants");
}
function usersCol(database: Db): Collection<User> {
  return database.collection<User>("users");
}

/** Index + seed, exécutés une seule fois par process. */
async function ready(): Promise<Db> {
  const database = await db();
  if (!globalForMongo._mongoReady) {
    globalForMongo._mongoReady = (async () => {
      await tenantsCol(database).createIndex({ slug: 1 }, { unique: true });
      await usersCol(database).createIndex({ email: 1 }, { unique: true });
      await usersCol(database).createIndex({ id: 1 }, { unique: true });
      await seedIfEmpty(database);
    })();
  }
  await globalForMongo._mongoReady;
  return database;
}

async function seedIfEmpty(database: Db): Promise<void> {
  if ((await usersCol(database).countDocuments()) > 0) return;

  const now = new Date().toISOString();
  const superEmail = process.env.SUPERADMIN_EMAIL || "superadmin@permis-oral.fr";
  const superPassword = process.env.SUPERADMIN_PASSWORD || "superadmin";

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

  const demo: Tenant = {
    slug: "demo",
    name: "Auto-École Démo",
    color: "#0ea5e9",
    logoUrl: "",
    createdAt: now,
  };

  try {
    await tenantsCol(database).insertOne(demo);
    await usersCol(database).insertMany([
      mkUser(superEmail, superPassword, "superadmin", null),
      mkUser("admin@demo.fr", "admin", "admin", "demo"),
      mkUser("eleve@demo.fr", "eleve", "student", "demo"),
    ]);
  } catch {
    // Seed concurrent : un autre process a déjà inséré (index uniques). On ignore.
  }
}

const strip = { projection: { _id: 0 } } as const;

// ---- Tenants ----

export async function listTenants(): Promise<Tenant[]> {
  const database = await ready();
  return tenantsCol(database).find({}, strip).sort({ name: 1 }).toArray();
}

export async function getTenant(slug: string): Promise<Tenant | undefined> {
  const database = await ready();
  return (await tenantsCol(database).findOne({ slug }, strip)) ?? undefined;
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export async function createTenant(input: {
  slug: string;
  name: string;
  color?: string;
  logoUrl?: string;
}): Promise<Tenant> {
  const database = await ready();
  const slug = input.slug.trim().toLowerCase();
  if (!isValidSlug(slug)) {
    throw new Error("Identifiant invalide (lettres minuscules, chiffres, tirets).");
  }
  if (await tenantsCol(database).findOne({ slug })) {
    throw new Error("Cet identifiant de tenant existe déjà.");
  }
  const tenant: Tenant = {
    slug,
    name: input.name.trim(),
    color: input.color?.trim() || "#4f46e5",
    logoUrl: input.logoUrl?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  await tenantsCol(database).insertOne(tenant);
  return tenant;
}

export async function updateTenantBranding(
  slug: string,
  patch: { name?: string; color?: string; logoUrl?: string }
): Promise<Tenant> {
  const database = await ready();
  const set: Partial<Tenant> = {};
  if (patch.name?.trim()) set.name = patch.name.trim();
  if (patch.color?.trim()) set.color = patch.color.trim();
  if (patch.logoUrl !== undefined) set.logoUrl = patch.logoUrl.trim();

  const updated = await tenantsCol(database).findOneAndUpdate(
    { slug },
    { $set: set },
    { returnDocument: "after", projection: { _id: 0 } }
  );
  if (!updated) throw new Error("Tenant introuvable.");
  return updated;
}

// ---- Utilisateurs ----

export async function getUserById(id: string): Promise<User | undefined> {
  const database = await ready();
  return (await usersCol(database).findOne({ id }, strip)) ?? undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const database = await ready();
  return (
    (await usersCol(database).findOne({ email: email.toLowerCase() }, strip)) ??
    undefined
  );
}

export async function listUsers(tenantSlug?: string): Promise<User[]> {
  const database = await ready();
  const filter = tenantSlug === undefined ? {} : { tenantSlug };
  return usersCol(database).find(filter, strip).sort({ email: 1 }).toArray();
}

export async function createUser(input: {
  email: string;
  password: string;
  role: User["role"];
  tenantSlug: string | null;
}): Promise<User> {
  const database = await ready();
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Adresse e-mail invalide.");
  }
  if (input.password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }
  if (await usersCol(database).findOne({ email })) {
    throw new Error("Un compte existe déjà avec cette adresse e-mail.");
  }
  if (input.role !== "superadmin" && !input.tenantSlug) {
    throw new Error("Un tenant est requis pour ce rôle.");
  }
  if (input.tenantSlug && !(await tenantsCol(database).findOne({ slug: input.tenantSlug }))) {
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
  await usersCol(database).insertOne(user);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const database = await ready();
  await usersCol(database).deleteOne({ id });
}
