import {
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

/** Hachage de mot de passe (scrypt) — renvoie le hash et le sel en hexadécimal. */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export const newId = (): string => randomUUID();

// ---- Jetons de session signés (HMAC, sans dépendance externe) ----

const SECRET =
  process.env.AUTH_SECRET ||
  "dev-insecure-secret-change-me-in-production-please-1234567890";

const base64url = (input: Buffer | string): string =>
  Buffer.from(input).toString("base64url");

interface SessionPayload {
  uid: string;
  exp: number;
}

/** Crée un jeton signé valable `days` jours. */
export function signSession(userId: string, days = 7): string {
  const payload: SessionPayload = {
    uid: userId,
    exp: Date.now() + days * 24 * 60 * 60 * 1000,
  };
  const body = base64url(JSON.stringify(payload));
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/** Vérifie le jeton et renvoie l'id utilisateur, ou `null` si invalide/expiré. */
export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString()
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload.uid;
  } catch {
    return null;
  }
}
