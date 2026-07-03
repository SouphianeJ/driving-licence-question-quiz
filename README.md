# Permis Oral — Plateforme multi-tenant pour auto-écoles

Plateforme web SaaS d'entraînement à la **partie orale de l'épreuve pratique du permis B**
(vérifications intérieures/extérieures, sécurité routière, premiers secours),
**multi-tenant** : chaque auto-école dispose de son espace personnalisé et de ses comptes.

> Stack : **Next.js 14 (App Router) · TypeScript · Tailwind CSS · MongoDB Atlas**.

## Multi-tenant par URL

| URL | Rôle | Description |
| --- | --- | --- |
| `/` | public | **Sélecteur d'auto-école** + accès connexion |
| `/login` | public | Connexion (e-mail / mot de passe) |
| `/admin` | superadmin | Console : création des tenants et des comptes |
| `/t/[tenant]` | membre du tenant | Accueil de l'auto-école (branding appliqué) |
| `/t/[tenant]/reviser` · `/examen` · `/fiches` · `/progression` | membre | Modules d'entraînement |
| `/t/[tenant]/settings` | admin du tenant | Personnalisation (couleur, logo) + gestion des comptes |

## Rôles

- **Superadmin** — crée les auto-écoles (tenants) et leurs comptes (admins, élèves, autres superadmins).
- **Admin** (d'un tenant) — gère la **couleur** et le **logo** de son auto-école et **crée les comptes** (élèves, admins) de son tenant.
- **Élève** — accède aux modules d'entraînement de son auto-école.

L'authentification repose sur un mot de passe haché (scrypt) et une session signée (HMAC,
cookie httpOnly). Les accès sont contrôlés côté serveur dans les layouts (aucune logique
sensible côté client).

## Démarrage

1. Créez un cluster **MongoDB Atlas** et récupérez la chaîne de connexion.
2. Copiez `.env.example` en `.env.local` et renseignez `MONGODB_URI` (et `AUTH_SECRET`).
3. Installez et lancez :

```bash
npm install
npm run db:check     # vérifie la connexion à MongoDB Atlas
npm run dev          # http://localhost:3000
```

Au premier lancement, si la base est vide, des données de démonstration sont
créées (voir `lib/server/store.ts`) :

| Rôle | E-mail | Mot de passe |
| --- | --- | --- |
| Superadmin | `superadmin@permis-oral.fr` | `superadmin` |
| Admin (tenant `demo`) | `admin@demo.fr` | `admin` |
| Élève (tenant `demo`) | `eleve@demo.fr` | `eleve` |

> ⚠️ En production, définissez `AUTH_SECRET` et changez les identifiants superadmin
> via `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD` (voir `.env.example`).

Autres scripts : `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`,
`npm run validate:data`, `npm test`.

## Personnalisation (marque blanche)

Le branding n'est **plus** dans `.env` : il est géré **par auto-école** depuis
`/t/[tenant]/settings` (réservé aux admins) et persisté côté serveur. La **couleur primaire**
est déclinée automatiquement en palette 50→900 (`lib/color.ts`) et recolorise toute
l'interface du tenant ; un **logo** (URL) peut également être défini.

## Persistance

Les tenants et les comptes sont stockés dans **MongoDB Atlas** (driver officiel
`mongodb`). La connexion est mise en cache au niveau du process, des **index uniques**
garantissent l'intégrité (`tenants.slug`, `users.email`) et un **seed idempotent** crée
les données initiales. Toute la logique d'accès est isolée dans `lib/server/store.ts`.
La progression des élèves reste, elle, locale à l'appareil (localStorage, cloisonnée par
tenant — RGPD).

## Architecture

```
app/
  page.tsx                 Sélecteur de tenant (accueil global)
  login/ · admin/          Connexion · console superadmin
  t/[tenant]/              Espace tenant (layout brandé + garde d'accès)
    page.tsx · reviser/ · examen/ · fiches/ · progression/ · settings/
components/                UI (en-têtes, formulaires, modules quiz)
config/brand.ts            Identité produit (niveau plateforme)
lib/
  server/                  types · store (MongoDB) · crypto · auth · actions
  questions.ts · color.ts · storage.ts · types.ts
data/questions.json        Banque des 100 fiches (source unique de vérité)
scripts/ · tests/          Validation et tests d'intégrité des données
```

## Contenu

Les 100 fiches couvrent l'intégralité du programme de l'oral. Contenu fourni à titre
pédagogique, non affilié à l'administration. Mise à jour dans `data/questions.json`
(format validé par `npm run validate:data`).
