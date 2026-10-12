# Portfolio full-stack — Next.js · FastAPI · PostgreSQL

Portfolio avec dashboard administrateur sécurisé. Tout le contenu dynamique (projets, compétences, formation, expérience, messages de contact) est stocké en base PostgreSQL et géré via une API REST.

```
Navigateur ──► Next.js (3000) ──/api/*, /uploads/*──► FastAPI (8000) ──► PostgreSQL (5432)
               site + /admin        (relais « rewrites »)    JWT, CRUD, uploads
```

Le navigateur ne parle qu'à Next.js : `/api/*` et `/uploads/*` sont relayés vers FastAPI. Résultat : pas de CORS, et le cookie de session est « same-origin ».

## Structure

```
frontend/                 Next.js 16 · React 19 · TypeScript · Tailwind 4
  src/app/                pages : site public (/) et dashboard (/admin/**)
  src/components/         layout, sections (site), ui, admin
  src/services/           appels à l'API (projets, auth, uploads…)
  src/lib/ · src/types/   client HTTP, utilitaires, types
  src/proxy.ts            protection des routes /admin
backend/
  app/api/routes/         auth, projects, skills, education, experiences, messages, uploads
  app/models/             SQLAlchemy      app/schemas/   Pydantic
  app/services/           logique métier  app/auth/      hash, JWT, dépendances
  app/database/           session/base    app/core/      configuration (.env)
  app/seed.py             admin + contenu initial
  tests/                  tests d'intégration (pytest)
database/migrations/      migrations Alembic
docker-compose.yml · .env.example
```

## Lancement avec Docker (recommandé)

```bash
cp .env.example .env        # puis éditez les valeurs (voir « Sécurité »)
docker compose up --build
```

| Service | URL |
|---|---|
| Site public | http://localhost:3000 |
| Dashboard admin | http://localhost:3000/admin |
| Swagger (API) | http://localhost:3000/api/docs ou http://localhost:8000/api/docs |

Connexion admin : `ADMIN_EMAIL` / `ADMIN_PASSWORD` du `.env`. Au premier démarrage, les migrations sont appliquées, le compte admin est créé et le contenu actuel du portfolio est importé (3 projets, 8 compétences, formation, expériences ; désactivable avec `SEED_DEMO_DATA=false`). Le seed ne réécrit jamais des données existantes.

Les données persistent dans les volumes Docker `pgdata` (base) et `uploads` (images).

## Développement local (sans Docker pour l'API et le site)

```bash
# 1) PostgreSQL seul
docker compose up db -d

# 2) Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
alembic upgrade head && python -m app.seed
uvicorn app.main:app --reload            # http://localhost:8000/api/docs

# 3) Frontend (autre terminal)
cd frontend
cp .env.example .env.local
npm install && npm run dev               # http://localhost:3000
```

Le backend lit le fichier `.env` de la racine (voir `.env.example`).

## Utiliser le dashboard

- **Projets** : ajout, modification, suppression, recherche, filtres (catégorie, statut), ordre d'affichage (flèches), image principale + images supplémentaires (upload), technologies, liens GitHub et démo, statut `Publié` / `Brouillon` / `Archivé`.
  Seuls les projets **publiés** apparaissent sur le site. Supprimer un projet le retire de la base et supprime ses images.
- **Compétences, Formation, Expérience** : ajout, modification, suppression, ordre.
- **Messages** : messages du formulaire de contact (lu/non lu, réponse par email, suppression).
- **Paramètres** : changement du mot de passe.

Les modifications apparaissent immédiatement sur le site (pas de rebuild). Sur le site, un projet qui a des images supplémentaires ouvre une galerie au clic ; les boutons GitHub/Démo ne s'affichent que si le lien est renseigné.

## API REST

Documentation interactive : `/api/docs` (Swagger) et `/api/redoc`. Bouton « Authorize » : utilisez l'email comme `username`.

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/login` · `/api/auth/logout` | public / — |
| GET · PUT | `/api/auth/me` · `/api/auth/password` | admin |
| GET | `/api/projects` (publiés) · `/api/projects/{id}` · `/api/projects/categories` | public |
| POST · PUT · DELETE | `/api/projects` · `/api/projects/{id}` | admin |
| PUT | `/api/projects/reorder` (`{"ids":[…]}`) | admin |
| GET | `/api/admin/projects?search=&category=&status=` | admin (tous statuts) |
| GET | `/api/skills` · `/api/education` · `/api/experiences` (+ `/{id}`) | public |
| POST · PUT · DELETE · PUT `/reorder` | mêmes routes | admin |
| POST | `/api/messages` | public (5 / 10 min / IP) |
| GET · PATCH · DELETE | `/api/messages` · `/api/messages/{id}` · `/api/messages/unread-count` | admin |
| POST | `/api/uploads` (JPEG/PNG/WebP/GIF, 5 Mo max) | admin |

## Base de données

Tables : `admin_users`, `projects` (titre, slug, description, image, technologies, liens, catégorie, date, statut, ordre, created_at, updated_at), `project_images` (galerie), `skills`, `education`, `experiences`, `contact_messages`. Les technologies d'un projet sont stockées en liste JSON (ordre conservé).

Nouvelle migration après modification d'un modèle :

```bash
cd backend && alembic revision --autogenerate -m "description" && alembic upgrade head
```

## Sécurité

- Mots de passe hashés avec **bcrypt** ; **JWT** (HS256) dans un cookie **httpOnly**, `SameSite=Lax` (+ en-tête `Authorization: Bearer` pour Swagger).
- Toutes les routes d'écriture exigent l'admin, vérifié par le backend à chaque requête ; `/admin/**` est aussi contrôlé côté Next.js (`proxy.ts` + layout serveur).
- Limitation des tentatives de connexion (10 / 15 min / IP) et du formulaire de contact, champ anti-spam invisible.
- Uploads : taille limitée, contenu réellement vérifié comme image, nom de fichier aléatoire. Liens de projets limités à `http(s)://`.

**Avant une mise en production :**
1. `ENVIRONMENT=production` : le backend refuse alors de démarrer avec un `SECRET_KEY` ou `ADMIN_PASSWORD` faible/par défaut.
2. Générer `SECRET_KEY` : `python -c "import secrets; print(secrets.token_urlsafe(48))"`.
3. Servir en **HTTPS** (reverse proxy) et mettre `COOKIE_SECURE=true`.
4. Ne pas exposer les ports 5432 et 8000 publiquement.
5. Limiteurs en mémoire : prévus pour une seule instance du backend.

## Tests

```bash
cd backend && pytest        # 17 tests (auth, protection, CRUD projets, upload, messages…)
# autre base : TEST_DATABASE_URL=postgresql+psycopg://... pytest
cd frontend && npm run typecheck && npm run lint && npm run build
```

## Ce qui a changé par rapport au projet d'origine

- Données auparavant écrites en dur → base de données (importées par le seed, textes et images identiques).
- Formulaire de contact : il n'envoyait rien, il enregistre maintenant les messages en base.
- Boutons GitHub/Démo : ils pointaient vers `#`, ils n'apparaissent plus que si un lien est saisi.
- Email, localisation, GitHub et LinkedIn : variables `SITE_*` du `.env` (le site affichait un email factice et des liens `#`).
- Police Geist chargée en local (`geist`) au lieu de Google Fonts ; dépendances inutilisées retirées (`gsap`, `@emailjs/browser`) ; composants `ui/` vides remplis.
