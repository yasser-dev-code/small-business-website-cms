# Maison Gourmet — Small Business Website CMS

> **Project 03 — Full-Stack Portfolio Project**
> A complete, production-style Content Management System that lets a small business owner manage their entire public website without touching source code.

🇫🇷 [Lire la documentation en français](./README.fr.md)

The demonstration business is **Maison Gourmet**, a fine French restaurant. The application ships two connected parts:

1. **Public restaurant website** — visitors browse the restaurant's information, services, menu and blog.
2. **Admin dashboard** — the owner signs in and manages every piece of content shown on the public site.

Changes saved in the admin panel appear on the public website immediately (published content only).

---

## Table of contents

- [Objectives](#objectives)
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Database models](#database-models)
- [API endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment configuration](#environment-configuration)
- [MongoDB setup](#mongodb-setup)
- [Database seeding](#database-seeding)
- [Running the app](#running-the-app)
- [Demo login](#demo-login)
- [Testing](#testing)
- [Build](#build)
- [Security](#security)
- [Screenshots](#screenshots)
- [Future improvements](#future-improvements)

---

## Objectives

- Build a **working full-stack application** (not a frontend mock-up) with a real database, authentication, REST APIs, CRUD operations and image uploads.
- Demonstrate a realistic product that could be delivered to an actual small business.
- Show professional code organisation, testing discipline and documentation.

## Features

### Public website
- Home, About, Services, Menu, Blog, Blog article details, Contact and 404 pages.
- Premium restaurant visual identity, responsive navigation and footer, subtle animations.
- Loading states and error handling on every data-driven view.
- All content is fetched from the backend API / MongoDB — nothing is hardcoded.

### Admin dashboard
- **Authentication** — login, logout, protected routes, persistent JWT session, friendly errors.
- **Dashboard overview** — published/draft article counts, services, menu items, recent activity, quick actions.
- **Homepage management** — headline, subtitle, intro, hero image, call-to-action, SEO title & meta description.
- **Services management** — create/edit/delete, image upload, publish/unpublish, featured flag.
- **Blog management** — create/edit/delete, featured image, excerpt, content, draft/publish workflow, auto-generated slugs, per-article SEO.
- **Menu management** — create/edit/delete, prices (Moroccan Dirham), categories, images, publish/unpublish, search & category filter.
- **Restaurant settings** — name, address, phone, email, opening hours, social links, About section.
- **Media library** — upload, preview, copy URL, delete; strict file-type and size validation.
- Search & filtering, confirmation dialogs, toasts, empty states, loading indicators, responsive tables.

## Technologies

| Layer | Stack |
|---|---|
| Frontend | React 18 (JavaScript), Vite, React Router, Tailwind CSS, Lucide React, Axios |
| Backend | Node.js, Express.js (JavaScript, ESM) |
| Database | MongoDB + Mongoose |
| Auth & security | JWT, bcryptjs, Helmet, CORS allow-list, express-rate-limit, express-validator, Multer (validated uploads) |
| Testing | Vitest, React Testing Library, Supertest, Playwright (screenshots / E2E) |

> **Currency:** all prices are stored as plain numbers in MongoDB and displayed in **Moroccan Dirham (MAD)**, formatted as `120 DH` via a reusable frontend formatting utility (`frontend/src/utils/currency.js`).

## Architecture

```
Browser (React SPA)  --HTTPS/JSON-->  Express REST API  -->  MongoDB (Mongoose ODM)
        |                                   |
        +-- /api/* (public + admin) --------+
        +-- /uploads/* (static media) ------+
```

- The frontend is a single-page app that consumes a versioned REST API under `/api`.
- Public endpoints return **published content only**; admin endpoints are guarded by JWT middleware.
- Uploaded images are stored on local disk (`backend/uploads`) and served statically at `/uploads`.

## Project structure

```
small-business-website-cms/
├── backend/
│   ├── src/
│   │   ├── config/        # env + database connection (with in-memory fallback)
│   │   ├── models/        # Admin, Homepage, Service, BlogPost, MenuItem, RestaurantSettings, Media
│   │   ├── controllers/   # request handlers per resource
│   │   ├── routes/        # auth, public, admin routers
│   │   ├── middleware/    # auth (JWT), error handler, upload (Multer), validation
│   │   ├── seed/          # seedData() + seed script
│   │   ├── app.js         # Express app factory
│   │   ├── server.js      # production entry
│   │   └── devServer.js   # demo entry (auto-seeds an empty DB)
│   ├── tests/             # Supertest API suite (Vitest)
│   └── uploads/           # local media storage (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── api/           # axios client + image resolver
│   │   ├── context/       # AuthContext (JWT session)
│   │   ├── hooks/         # useFetch
│   │   ├── components/    # public/, admin/, ui/ shared components
│   │   └── pages/         # public/ and admin/ route pages
│   ├── scripts/           # capture-screenshots.mjs (Playwright)
│   └── tests/             # React Testing Library suite (Vitest)
├── screenshots/           # real product screenshots
├── .env.example
├── .gitignore
├── README.md
└── README.fr.md
```

## Database models

| Model | Purpose | Key fields |
|---|---|---|
| `Admin` | Dashboard users | name, email (unique), password (bcrypt, select:false), role |
| `Homepage` | Single homepage document | headline, subtitle, heroImage, introTitle, introText, ctaText, ctaLink, seo |
| `Service` | Offered services | title, description, image, icon, featured, published, order |
| `BlogPost` | Articles | title, slug (unique, auto), excerpt, content, featuredImage, author, tags, status, publishedAt, seo |
| `MenuItem` | Menu dishes | name, description, price, category, image, featured, published, order |
| `RestaurantSettings` | Business info | name, tagline, address, phone, email, openingHours[], social, about* |
| `Media` | Uploaded files | filename, originalName, url, mimetype, size |

All models use Mongoose timestamps and required-field validation.

## API endpoints

**Authentication**
| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/login` | public (rate-limited) |
| GET | `/api/auth/me` | admin |
| POST | `/api/auth/logout` | admin |

**Public content (published only)**
| Method | Path |
|---|---|
| GET | `/api/homepage` |
| GET | `/api/services` |
| GET | `/api/services/:id` |
| GET | `/api/blog` |
| GET | `/api/blog/:slug` |
| GET | `/api/menu` |
| GET | `/api/settings` |

**Admin (JWT required)**
| Method | Path |
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

Prerequisites: **Node.js 18+**, npm. MongoDB is optional (see below).

```bash
# 1. Clone
git clone https://github.com/yasser-dev-code/small-business-website-cms.git
cd small-business-website-cms

# 2. Backend
cd backend
npm install
cp .env.example .env        # then edit values (see below)

# 3. Frontend
cd ../frontend
npm install
```

## Environment configuration

Copy `backend/.env.example` to `backend/.env`:

```ini
PORT=5000
NODE_ENV=development
MONGO_URI=                      # leave empty to use the built-in in-memory MongoDB
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=5
DEMO_ADMIN_NAME=Maison Gourmet Owner
DEMO_ADMIN_EMAIL=admin@maisongourmet.com
DEMO_ADMIN_PASSWORD=Admin123!
```

The frontend uses Vite env vars (optional): `VITE_API_URL` (defaults to the dev proxy `/api`).

## MongoDB setup

You have two options:

1. **Zero-setup (default):** leave `MONGO_URI` empty. The backend automatically starts an **in-memory MongoDB** (`mongodb-memory-server`), so the app runs anywhere with no local database. Data resets on restart — perfect for demos and CI.
2. **Persistent:** install MongoDB locally or use Atlas, then set e.g.
   `MONGO_URI=mongodb://127.0.0.1:27017/maison_gourmet_cms`

## Database seeding

```bash
cd backend
npm run seed
```

The seed creates the demo admin, homepage content, restaurant settings, 4 services, 8 menu items and 4 blog articles (3 published, 1 draft).

> Tip: `npm run dev:demo` starts the API and **auto-seeds** if the database is empty — the easiest way to get a fully populated demo.

## Running the app

```bash
# Terminal 1 — backend (API on http://localhost:5000)
cd backend
npm run dev:demo        # or: npm run dev  (no auto-seed) / npm start

# Terminal 2 — frontend (http://localhost:5173, proxies /api -> :5000)
cd frontend
npm run dev
```

Open **http://localhost:5173** for the public site and **http://localhost:5173/admin/login** for the dashboard.

## Demo login

| Email | Password |
|---|---|
| `admin@maisongourmet.com` | `Admin123!` |

**Change the demo password** by editing `DEMO_ADMIN_PASSWORD` in `backend/.env` and re-running `npm run seed` (or delete the admin and re-seed). Never deploy with the demo credentials.

## Testing

```bash
# Backend (Supertest + Vitest, real in-memory MongoDB)
cd backend && npm test

# Frontend (React Testing Library + Vitest + jsdom)
cd frontend && npm test

# Production builds
cd backend && npm test
cd ../frontend && npm run build

# Real screenshots / E2E capture (requires both servers running)
cd frontend && node scripts/capture-screenshots.mjs
```

The Playwright script drives a real Chromium browser through the public site and the authenticated admin dashboard, saving PNGs into `screenshots/`.

## Build

```bash
cd frontend && npm run build     # outputs frontend/dist
```

The backend is plain Node (no build step).

## Security

- Passwords hashed with **bcrypt** (never stored in plain text).
- **JWT** bearer authentication; admin-only middleware on every `/api/admin/*` route.
- **Helmet** security headers; **CORS** restricted to the configured client origin.
- **Rate limiting** on the login endpoint.
- **Input validation** (express-validator) on auth and create routes; Mongoose schema validation everywhere.
- **Upload validation**: only JPEG/PNG/WEBP/GIF, size capped (default 5 MB), randomised filenames.
- Secrets live only in `.env` (git-ignored); `.env.example` documents every variable.

## Screenshots

All screenshots below are **real captures** of the running application (Playwright, Chromium).

### Public website

| Home | About |
|---|---|
| ![Public home](screenshots/01-public-home.png) | ![Public about](screenshots/02-public-about.png) |

| Services | Menu |
|---|---|
| ![Public services](screenshots/03-public-services.png) | ![Public menu](screenshots/04-public-menu.png) |

| Blog | Blog article |
|---|---|
| ![Public blog](screenshots/05-public-blog.png) | ![Blog detail](screenshots/06-public-blog-detail.png) |

![Public contact](screenshots/07-public-contact.png)

### Admin dashboard

| Login | Dashboard |
|---|---|
| ![Admin login](screenshots/08-admin-login.png) | ![Admin dashboard](screenshots/09-admin-dashboard.png) |

| Homepage editor | Services manager |
|---|---|
| ![Homepage editor](screenshots/10-admin-homepage-editor.png) | ![Services](screenshots/11-admin-services.png) |

| Blog manager | Blog editor |
|---|---|
| ![Blog manager](screenshots/12-admin-blog.png) | ![Blog editor](screenshots/13-admin-blog-editor.png) |

| Menu manager | Settings |
|---|---|
| ![Menu manager](screenshots/14-admin-menu.png) | ![Settings](screenshots/16-admin-settings.png) |

![Media library](screenshots/15-admin-media.png)

## Future improvements

- Rich-text (WYSIWYG) article editor with image embedding.
- Multi-user roles and permissions (editor vs owner).
- Pagination and server-side search for large collections.
- Cloud storage (S3) for media instead of local disk.
- Reservation / contact-form persistence with email notifications.
- i18n for the public site (EN/FR).
- Automated Playwright E2E assertions in CI (currently used for screenshots).
