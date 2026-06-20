# Permis Oral — Entraînement à l'interrogation orale du permis B

Plateforme web d'entraînement à la **partie orale de l'épreuve pratique du permis B**
(vérifications intérieures/extérieures, sécurité routière, premiers secours).
Conçue pour être **commercialisée en marque blanche auprès des auto-écoles**.

> Réécriture complète et sans dette technique de l'ancien prototype.
> Stack moderne : **Next.js 14 (App Router) · TypeScript · Tailwind CSS**.

## Fonctionnalités

| Module | Description |
| --- | --- |
| **Accueil** | Page de présentation orientée auto-écoles, avec statistiques et pitch commercial. |
| **Réviser** | Parcours des fiches, réponses masquées, filtres (intérieure/extérieure), mélange, suivi « acquise / à revoir », raccourcis clavier. |
| **Examen blanc** | Tirage aléatoire (3/5/10 fiches), auto-évaluation par volet, score détaillé par thème. |
| **Fiches** | Référentiel consultable et recherchable des 100 fiches avec réponses. |
| **Progression** | Tableau de bord élève (maîtrise, historique des examens), stocké localement (RGPD). |

## Démarrage

```bash
npm install
npm run dev          # http://localhost:3000
```

Autres scripts :

```bash
npm run build        # build de production
npm run start        # serveur de production
npm run lint         # ESLint
npm run typecheck    # vérification TypeScript
npm run validate:data # intégrité de data/questions.json
npm test             # tests (node:test)
```

## Personnalisation en marque blanche

Aucune modification de code n'est nécessaire : copiez `.env.example` en `.env.local`
et adaptez les variables.

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_BRAND_NAME` | Nom de la marque/produit |
| `NEXT_PUBLIC_SCHOOL_NAME` | Nom de l'auto-école cliente |
| `NEXT_PUBLIC_BRAND_TAGLINE` | Slogan de la page d'accueil |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail de contact (pied de page, démo) |
| `NEXT_PUBLIC_PRIMARY_COLOR` | Couleur primaire (hex) — génère toute la palette |

La couleur primaire est déclinée automatiquement en une palette 50→900
(`lib/color.ts`) injectée via des variables CSS, ce qui re-colorise toute
l'interface à partir d'une seule valeur.

## Architecture

```
app/                Pages (App Router) : accueil, reviser, examen, fiches, progression
components/         Composants UI réutilisables (client & serveur)
config/brand.ts     Configuration marque blanche
lib/                Domaine : types, chargement des fiches, palette, persistance
data/questions.json Banque des fiches officielles (source unique de vérité)
scripts/            Validation des données
tests/              Tests d'intégrité des données
```

## Contenu

Les 100 fiches couvrent l'intégralité du programme de l'oral. Le contenu est
fourni à titre pédagogique et n'est pas affilié à l'administration. Il peut être
mis à jour dans `data/questions.json` (le format est validé par `npm run validate:data`).
