/**
 * Configuration en marque blanche.
 *
 * Chaque auto-école peut personnaliser le nom, le slogan, les coordonnées
 * et la couleur primaire sans toucher au code, via des variables
 * d'environnement `NEXT_PUBLIC_*` (voir .env.example). Les valeurs par
 * défaut ci-dessous fournissent une marque générique prête à l'emploi.
 */

export interface Brand {
  /** Nom court affiché dans l'en-tête et le pied de page. */
  name: string;
  /** Nom de l'auto-école cliente (vide = produit générique). */
  schoolName: string;
  /** Slogan affiché sur la page d'accueil. */
  tagline: string;
  /** Adresse e-mail de contact. */
  contactEmail: string;
  /** Couleur primaire au format hexadécimal (#RRGGBB). */
  primaryColor: string;
}

const env = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : fallback;
};

export const brand: Brand = {
  name: env("NEXT_PUBLIC_BRAND_NAME", "Permis Oral"),
  schoolName: env("NEXT_PUBLIC_SCHOOL_NAME", ""),
  tagline: env(
    "NEXT_PUBLIC_BRAND_TAGLINE",
    "Maîtrisez l'interrogation orale du permis B"
  ),
  contactEmail: env("NEXT_PUBLIC_CONTACT_EMAIL", "contact@permis-oral.fr"),
  primaryColor: env("NEXT_PUBLIC_PRIMARY_COLOR", "#4f46e5"),
};

/** Titre complet, suffixé par le nom de l'auto-école si défini. */
export const fullTitle = brand.schoolName
  ? `${brand.name} · ${brand.schoolName}`
  : brand.name;
