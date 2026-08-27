# Boat Brokers

Full-stack website: React + TypeScript client, Node.js + Express + TypeScript API, MySQL database (via Prisma ORM).

## Stack

- **client/** — React + TypeScript, built with Vite. Dev server proxies `/api` to the backend.
- **server/** — Node.js + Express + TypeScript API, using Prisma as the ORM.
- **MySQL** — runs locally via Docker Compose (`docker-compose.yml`).

This is an npm workspaces monorepo — one `npm install` at the root installs both `client` and `server`.

## Prerequisites

- Node.js 20+ and npm
- Docker Desktop (for local MySQL)

## First-time setup

```bash
npm install                 # installs client + server dependencies
npm run db:up                # starts MySQL in Docker (host port 3307)
cp server/.env.example server/.env   # adjust if needed
npm run prisma:migrate       # creates tables from prisma/schema.prisma
```

The default `.env` connects as MySQL `root` because the app-scoped `boatbrokers` user
lacks permission to create Prisma's shadow database used during `migrate dev`. For
day-to-day query access from the app (not migrations), you can switch to the
`boatbrokers` / `boatbrokers` credentials also created by `docker-compose.yml`.

## Running in development

In two terminals:

```bash
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

The client dev server proxies `/api/*` requests to the backend, so the browser only
ever talks to `http://localhost:5173`.

## Useful scripts (run from repo root)

| Command                 | Description                              |
|--------------------------|-------------------------------------------|
| `npm run dev:client`     | Start the Vite dev server                 |
| `npm run dev:server`     | Start the API with hot reload (`tsx`)     |
| `npm run build:client`   | Production build of the client            |
| `npm run build:server`   | Compile the server to `server/dist`       |
| `npm run db:up`          | Start the MySQL container                 |
| `npm run db:down`        | Stop the MySQL container                  |
| `npm run prisma:generate`| Regenerate the Prisma client              |
| `npm run prisma:migrate` | Create/apply a new migration              |

## Project layout

```
client/     React + TypeScript app (Vite)
server/
  src/
    index.ts       Express app entry point
    routes/         API route handlers
    lib/prisma.ts   Shared Prisma client instance
  prisma/
    schema.prisma   Data model (Boat, Broker)
    migrations/     Generated SQL migrations
docker-compose.yml  Local MySQL service
```

## Notes

- Prisma is pinned to the last stable 6.x release. `prisma@latest`/`@prisma/client@latest`
  currently resolve to an 8.0 release candidate with a different CLI and config format
  (driver adapters + `prisma.config.ts`) — don't upgrade past 6.x without adopting that
  new setup deliberately.
- The MySQL container publishes on host port **3307**, not 3306, because another local
  project's database container was already bound to 3306.
