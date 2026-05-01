# airbnb-monopoly

MVP type Airbnb : **Next.js (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL** — authentification (hôte / voyageur), annonces, recherche (ville + dates), réservations avec **refus des chevauchements** de dates.

**Écosystème :** `GET http://127.0.0.1:8004/ecosystem` sur [services-Monopoly-](../services-Monopoly-/README.md#decouverte-des-services-ecosystem) inclut l’URL de cette app (`AIRBNB_MONOPOLY_BASE_URL`, défaut `http://127.0.0.1:3001`). En local, si **Web Monopoly** tourne déjà sur le port `3000`, lancez cette app sur **`3001`** (par ex. `set PORT=3001` puis `npm run dev`) pour éviter le conflit.

## Prérequis

- Node.js 20+ (LTS recommandé)
- PostgreSQL 14+
- npm ou pnpm

## Configuration

1. Copier l’exemple d’environnement :

   ```bash
   copy .env.example .env
   ```

2. Renseigner dans `.env` :

   - `DATABASE_URL` — chaîne Prisma PostgreSQL  
   - `JWT_SECRET` — au moins 16 caractères (secret fort en production)

## Base de données

Générer le client Prisma et appliquer le schéma :

```bash
npm install
npx prisma generate
npx prisma db push
```

Ou avec migrations nommées :

```bash
npx prisma migrate dev --name init
```

## Données de démo (seed)

```bash
npx prisma db seed
```

Comptes créés (mot de passe : `password123`) :

- Hôte : `hote@example.com`
- Voyageur : `voyageur@example.com`

## Lancer l’application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts utiles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement Next.js |
| `npm run build` | Build production |
| `npm run start` | Démarrer le build |
| `npm run lint` | ESLint |
| `npm test` | Tests Vitest (chevauchement de réservations) |
| `npx prisma studio` | UI Prisma |

## Structure fonctionnelle

- `/` — catalogue + filtres (ville, arrivée / départ)
- `/listings/[id]` — détail + réservation (utilisateur connecté, pas propriétaire)
- `/login`, `/register` — session cookie JWT httpOnly
- `/host/listings` — CRUD hôte (création, édition, suppression)
- `/reservations` — réservations du voyageur connecté

## API (route handlers)

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST /api/listings`, `GET/PATCH/DELETE /api/listings/[id]`
- `POST /api/reservations`, `GET /api/reservations/me`

## Tests

La règle métier de chevauchement de plages est testée dans `lib/reservation-overlap.test.ts`.

```bash
npm test
```

## Licence

Projet de démonstration / MVP.

## Paiements Stripe (via services-Monopoly-)

- Variable d'environnement requise : `SERVICES_MONOPOLY_BASE_URL` (defaut local `http://127.0.0.1:8004`).
- `POST /api/reservations` renvoie maintenant une charge utile additive : `{ reservation, paymentLinkUrl }`.
- `paymentLinkUrl` peut etre `null` si le service paiements est indisponible (fallback MVP).
- Le proxy de generation de lien est teste dans `lib/payment-links.test.ts`.
