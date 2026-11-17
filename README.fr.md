# Maison Gourmet — CMS de site web pour petite entreprise

> **Projet 03 — Projet portfolio full-stack**
> Un système de gestion de contenu (CMS) complet, de niveau production, qui permet à un propriétaire de petite entreprise de gérer tout son site web public sans toucher au code source.

🇬🇧 [Read the English documentation](./README.md)

L'entreprise de démonstration est **Maison Gourmet**, un restaurant gastronomique français. L'application comprend deux parties connectées :

1. **Site web public du restaurant** — les visiteurs consultent les informations, services, menu et blog.
2. **Tableau de bord d'administration** — le propriétaire se connecte et gère chaque contenu affiché sur le site public.

Les modifications enregistrées dans l'administration apparaissent immédiatement sur le site public (contenu publié uniquement).

---

## Sommaire

- [Objectifs](#objectifs)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Modèles de base de données](#modèles-de-base-de-données)
- [Endpoints API](#endpoints-api)
- [Installation](#installation)
- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Configuration MongoDB](#configuration-mongodb)
- [Peuplement de la base](#peuplement-de-la-base)
- [Démarrage de l'application](#démarrage-de-lapplication)
- [Connexion de démonstration](#connexion-de-démonstration)
- [Tests](#tests)
- [Build](#build)
- [Sécurité](#sécurité)
- [Captures d'écran](#captures-décran)
- [Améliorations futures](#améliorations-futures)

---

## Objectifs

- Construire une **application full-stack fonctionnelle** (pas une maquette frontend) avec une vraie base de données, authentification, API REST, opérations CRUD et téléversement d'images.
- Présenter un produit réaliste, livrable à une véritable petite entreprise.
- Démontrer une organisation de code professionnelle, une discipline de test et une documentation soignée.

## Fonctionnalités

### Site web public
- Pages Accueil, À propos, Services, Menu, Blog, Détail d'article, Contact et 404.
- Identité visuelle premium de restaurant, navigation et pied de page responsives, animations subtiles.
- États de chargement et gestion d'erreurs sur toutes les vues alimentées par données.
- Tout le contenu provient de l'API backend / MongoDB — rien n'est codé en dur.

### Tableau de bord d'administration
- **Authentification** — connexion, déconnexion, routes protégées, session JWT persistante, messages d'erreur conviviaux.
- **Vue d'ensemble** — nombre d'articles publiés/brouillons, services, plats du menu, activité récente, actions rapides.
- **Gestion de la page d'accueil** — titre, sous-titre, introduction, image héro, appel à l'action, titre SEO et méta-description.
- **Gestion des services** — créer/modifier/supprimer, téléversement d'image, publier/dépublier, mise en avant.
- **Gestion du blog** — créer/modifier/supprimer, image à la une, extrait, contenu, workflow brouillon/publication, slugs générés automatiquement, SEO par article.
- **Gestion du menu** — créer/modifier/supprimer, prix (dirham marocain), catégories, images, publier/dépublier, recherche et filtre par catégorie.
- **Paramètres du restaurant** — nom, adresse, téléphone, email, horaires, réseaux sociaux, section À propos.
- **Médiathèque** — téléverser, prévisualiser, copier l'URL, supprimer ; validation stricte du type et de la taille des fichiers.
- Recherche et filtres, boîtes de confirmation, notifications, états vides, indicateurs de chargement, tableaux responsives.

## Technologies

| Couche | Stack |
|---|---|
| Frontend | React 18 (JavaScript), Vite, React Router, Tailwind CSS, Lucide React, Axios |
| Backend | Node.js, Express.js (JavaScript, ESM) |
| Base de données | MongoDB + Mongoose |
| Auth & sécurité | JWT, bcryptjs, Helmet, liste blanche CORS, express-rate-limit, express-validator, Multer (uploads validés) |
| Tests | Vitest, React Testing Library, Supertest, Playwright (captures / E2E) |

> **Devise :** tous les prix sont stockés sous forme de nombres dans MongoDB et affichés en **dirham marocain (MAD)**, au format `120 DH`, via un utilitaire de formatage réutilisable (`frontend/src/utils/currency.js`).

## Architecture

```
Navigateur (SPA React)  --HTTPS/JSON-->  API REST Express  -->  MongoDB (Mongoose ODM)
        |                                        |
        +-- /api/* (public + admin) -------------+
        +-- /uploads/* (médias statiques) -------+
```

- Le frontend est une application monopage qui consomme une API REST versionnée sous `/api`.
- Les endpoints publics ne renvoient que le **contenu publié** ; les endpoints admin sont protégés par un middleware JWT.
- Les images téléversées sont stockées sur disque local (`backend/uploads`) et servies statiquement sous `/uploads`.

## Structure du projet

```
small-business-website-cms/
├── backend/
│   ├── src/
│   │   ├── config/        # env + connexion base (avec repli en mémoire)
│   │   ├── models/        # Admin, Homepage, Service, BlogPost, MenuItem, RestaurantSettings, Media
│   │   ├── controllers/   # gestionnaires de requêtes par ressource
│   │   ├── routes/        # routeurs auth, public, admin
│   │   ├── middleware/    # auth (JWT), gestion d'erreurs, upload (Multer), validation
│   │   ├── seed/          # seedData() + script de peuplement
│   │   ├── app.js         # fabrique de l'app Express
│   │   ├── server.js      # point d'entrée production
│   │   └── devServer.js   # point d'entrée démo (peuple une base vide)
│   ├── tests/             # suite API Supertest (Vitest)
│   └── uploads/           # stockage média local (ignoré par git)
├── frontend/
│   ├── src/
│   │   ├── api/           # client axios + résolveur d'images
│   │   ├── context/       # AuthContext (session JWT)
│   │   ├── hooks/         # useFetch
│   │   ├── components/    # composants partagés public/, admin/, ui/
│   │   └── pages/         # pages de routes public/ et admin/
│   ├── scripts/           # capture-screenshots.mjs (Playwright)
│   └── tests/             # suite React Testing Library (Vitest)
├── screenshots/           # captures réelles du produit
├── .env.example
├── .gitignore
├── README.md
└── README.fr.md
```

## Modèles de base de données

| Modèle | Rôle | Champs clés |
|---|---|---|
| `Admin` | Utilisateurs du tableau de bord | name, email (unique), password (bcrypt, select:false), role |
| `Homepage` | Document unique de la page d'accueil | headline, subtitle, heroImage, introTitle, introText, ctaText, ctaLink, seo |
| `Service` | Services proposés | title, description, image, icon, featured, published, order |
| `BlogPost` | Articles | title, slug (unique, auto), excerpt, content, featuredImage, author, tags, status, publishedAt, seo |
| `MenuItem` | Plats du menu | name, description, price, category, image, featured, published, order |
| `RestaurantSettings` | Informations de l'établissement | name, tagline, address, phone, email, openingHours[], social, about* |
| `Media` | Fichiers téléversés | filename, originalName, url, mimetype, size |

Tous les modèles utilisent les horodatages Mongoose et la validation des champs requis.

## Endpoints API

**Authentification**
| Méthode | Chemin | Accès |
|---|---|---|
| POST | `/api/auth/login` | public (limité en débit) |
| GET | `/api/auth/me` | admin |
| POST | `/api/auth/logout` | admin |

**Contenu public (publié uniquement)**
| Méthode | Chemin |
|---|---|
| GET | `/api/homepage` |
| GET | `/api/services` |
| GET | `/api/services/:id` |
| GET | `/api/blog` |
| GET | `/api/blog/:slug` |
| GET | `/api/menu` |
| GET | `/api/settings` |

**Admin (JWT requis)**
| Méthode | Chemin |
|---|---|
| GET | `/api/admin/stats` |
| PUT | `/api/admin/homepage` |
| GET/POST | `/api/admin/services` |
| PUT/DELETE | `/api/admin/services/:id` |
| GET/POST | `/api/admin/blog` |
| PUT/DELETE | `/api/admin/blog/:id` |
| GET/POST | `/api/admin/menu` |
| PUT/DELETE | `/api/admin/menu/:id` |
| PUT | `/api/admin/settings` |
| GET | `/api/admin/media` |
| POST | `/api/admin/media` (multipart `image`) |
| DELETE | `/api/admin/media/:id` |

## Installation

Prérequis : **Node.js 18+**, npm. MongoDB est optionnel (voir ci-dessous).

```bash
# 1. Cloner
git clone https://github.com/yasser-dev-code/small-business-website-cms.git
cd small-business-website-cms

# 2. Backend
cd backend
npm install
cp .env.example .env        # puis modifier les valeurs (voir ci-dessous)

# 3. Frontend
cd ../frontend
npm install
```

## Configuration de l'environnement

Copiez `backend/.env.example` vers `backend/.env` :

```ini
PORT=5000
NODE_ENV=development
MONGO_URI=                      # laisser vide pour utiliser la MongoDB en mémoire intégrée
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=5
DEMO_ADMIN_NAME=Maison Gourmet Owner
DEMO_ADMIN_EMAIL=admin@maisongourmet.com
DEMO_ADMIN_PASSWORD=Admin123!
```

Le frontend utilise des variables Vite (optionnelles) : `VITE_API_URL` (par défaut le proxy de dev `/api`).

## Configuration MongoDB

Deux options :

1. **Sans configuration (défaut) :** laissez `MONGO_URI` vide. Le backend démarre automatiquement une **MongoDB en mémoire** (`mongodb-memory-server`) : l'application fonctionne partout sans base locale. Les données sont réinitialisées au redémarrage — idéal pour démos et CI.
2. **Persistante :** installez MongoDB localement ou utilisez Atlas, puis définissez par ex.
   `MONGO_URI=mongodb://127.0.0.1:27017/maison_gourmet_cms`

## Peuplement de la base

```bash
cd backend
npm run seed
```

Le peuplement crée l'admin de démo, le contenu de la page d'accueil, les paramètres du restaurant, 4 services, 8 plats et 4 articles de blog (3 publiés, 1 brouillon).

> Astuce : `npm run dev:demo` démarre l'API et **peuple automatiquement** une base vide — le moyen le plus simple d'obtenir une démo complète.

## Démarrage de l'application

```bash
# Terminal 1 — backend (API sur http://localhost:5000)
cd backend
npm run dev:demo        # ou : npm run dev (sans peuplement auto) / npm start

# Terminal 2 — frontend (http://localhost:5173, proxy /api -> :5000)
cd frontend
npm run dev
```

Ouvrez **http://localhost:5173** pour le site public et **http://localhost:5173/admin/login** pour le tableau de bord.

## Connexion de démonstration

| Email | Mot de passe |
|---|---|
| `admin@maisongourmet.com` | `Admin123!` |

**Changer le mot de passe de démo** : modifiez `DEMO_ADMIN_PASSWORD` dans `backend/.env` puis relancez `npm run seed` (ou supprimez l'admin et repeuplez). Ne déployez jamais avec les identifiants de démo.

## Tests

```bash
# Backend (Supertest + Vitest, vraie MongoDB en mémoire)
cd backend && npm test

# Frontend (React Testing Library + Vitest + jsdom)
cd frontend && npm test

# Builds de production
cd backend && npm test
cd ../frontend && npm run build

# Captures réelles / E2E (nécessite les deux serveurs démarrés)
cd frontend && node scripts/capture-screenshots.mjs
```

Le script Playwright pilote un vrai navigateur Chromium à travers le site public et le tableau de bord authentifié, et enregistre les PNG dans `screenshots/`.

## Build

```bash
cd frontend && npm run build     # produit frontend/dist
```

Le backend est du Node pur (aucune étape de build).

## Sécurité

- Mots de passe hachés avec **bcrypt** (jamais en clair).
- Authentification par jeton **JWT** ; middleware réservé admin sur toutes les routes `/api/admin/*`.
- En-têtes de sécurité **Helmet** ; **CORS** restreint à l'origine client configurée.
- **Limitation de débit** sur l'endpoint de connexion.
- **Validation des entrées** (express-validator) sur l'auth et les créations ; validation de schéma Mongoose partout.
- **Validation des uploads** : JPEG/PNG/WEBP/GIF uniquement, taille plafonnée (5 Mo par défaut), noms de fichiers aléatoires.
- Les secrets vivent uniquement dans `.env` (ignoré par git) ; `.env.example` documente chaque variable.

## Captures d'écran

Toutes les captures ci-dessous sont des **captures réelles** de l'application en cours d'exécution (Playwright, Chromium).

### Site web public

| Accueil | À propos |
|---|---|
| ![Accueil public](screenshots/01-public-home.png) | ![À propos](screenshots/02-public-about.png) |

| Services | Menu |
|---|---|
| ![Services](screenshots/03-public-services.png) | ![Menu](screenshots/04-public-menu.png) |

| Blog | Article de blog |
|---|---|
| ![Blog](screenshots/05-public-blog.png) | ![Détail d'article](screenshots/06-public-blog-detail.png) |

![Contact](screenshots/07-public-contact.png)

### Tableau de bord d'administration

| Connexion | Tableau de bord |
|---|---|
| ![Connexion admin](screenshots/08-admin-login.png) | ![Tableau de bord](screenshots/09-admin-dashboard.png) |

| Éditeur d'accueil | Gestion des services |
|---|---|
| ![Éditeur d'accueil](screenshots/10-admin-homepage-editor.png) | ![Services](screenshots/11-admin-services.png) |

| Gestion du blog | Éditeur d'article |
|---|---|
| ![Gestion du blog](screenshots/12-admin-blog.png) | ![Éditeur d'article](screenshots/13-admin-blog-editor.png) |

| Gestion du menu | Paramètres |
|---|---|
| ![Gestion du menu](screenshots/14-admin-menu.png) | ![Paramètres](screenshots/16-admin-settings.png) |

![Médiathèque](screenshots/15-admin-media.png)

## Améliorations futures

- Éditeur d'articles riche (WYSIWYG) avec insertion d'images.
- Rôles et permissions multi-utilisateurs (éditeur vs propriétaire).
- Pagination et recherche côté serveur pour les grandes collections.
- Stockage cloud (S3) des médias au lieu du disque local.
- Persistance des réservations / formulaire de contact avec notifications email.
- i18n du site public (EN/FR).
- Assertions E2E Playwright automatisées en CI (actuellement utilisées pour les captures).
