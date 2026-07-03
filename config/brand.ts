/**
 * Identité du produit (niveau plateforme, multi-tenant).
 *
 * Le branding par auto-école (nom, couleur, logo) n'est plus défini ici :
 * il est géré par tenant dans la page Réglages et stocké côté serveur.
 * Ce fichier ne porte plus que l'identité globale de la plateforme.
 */
export const product = {
  name: "Permis Oral",
  tagline: "La plateforme d'entraînement à l'interrogation orale du permis B",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@permis-oral.fr",
} as const;
