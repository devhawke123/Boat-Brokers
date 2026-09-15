# Boat Brokers

Full-stack website: React + TypeScript frontend, Node.js + Express + TypeScript API, MySQL database (via Prisma ORM).

## Stack

- **Frontend/** — React 19 + TypeScript, built with Vite 8, styled with Tailwind CSS v4. Dev server proxies `/api` and `/media` to the backend.
- **Backend/** — Node.js + Express + TypeScript API, using Prisma as the ORM.
- **MySQL** — runs locally via Docker Compose (`docker-compose.yml`), on host port **3307**.

This is an npm workspaces monorepo — one `npm install` at the root installs both
workspaces and hoists shared dependencies into the root `node_modules`. The workspace
packages are named `frontend` and `backend`, matching their directories.

## Prerequisites

- Node.js 20+ and npm
- Docker Desktop (for local MySQL)

## First-time setup

```bash
npm install                      # installs both workspaces from the repo root
npm run db:up                    # starts MySQL in Docker (host port 3307)
cp Backend/.env.example Backend/.env   # adjust if needed
npm run prisma:migrate           # creates tables from prisma/schema.prisma
```

The default `.env` connects as MySQL `root` because the app-scoped `boatbrokers` user
lacks permission to create Prisma's shadow database used during `migrate dev`. For
day-to-day query access from the app (not migrations), you can switch to the
`boatbrokers` / `boatbrokers` credentials also created by `docker-compose.yml`.

## Running in development

In two terminals, from the repo root:

```bash
npm run dev:server               # http://localhost:4000
npm run dev:client               # http://localhost:5173 (port auto-increments if busy)
```

The frontend dev server proxies `/api/*` and `/media/*` to the backend, so the browser only
ever talks to the Vite origin. **Always read the actual port from the Vite output** — it
auto-increments when 5173 is taken.

## Useful scripts

From the repo root:

| Command                   | Description                                |
|---------------------------|--------------------------------------------|
| `npm run dev:client`      | Vite dev server                            |
| `npm run dev:server`      | API with hot reload (`tsx watch`)          |
| `npm run build:client`    | Production build of the frontend           |
| `npm run build:server`    | Compile the API to `Backend/dist`          |
| `npm run db:up` / `db:down` | Start / stop the MySQL container          |
| `npm run prisma:migrate`  | Create/apply a migration                   |
| `npm run prisma:generate` | Regenerate the Prisma client               |

From `Backend/` (no root equivalents):

| Command                     | Description                                       |
|-----------------------------|---------------------------------------------------|
| `npx prisma studio`         | Browse the database in a GUI                      |
| `node prisma/seed.js`       | Seed boats from `prisma/seed-data/boats.json`     |
| `node prisma/seed-blogs.js` | Seed blog posts from `prisma/seed-data/blogs.json` |

From `Frontend/`: `npm run lint` (oxlint).

Note `build:client` runs `tsc -b && vite build`, so type errors fail the build.

## Project layout

```
Frontend/    React + TypeScript app (Vite + Tailwind v4)
  CLAUDE.md          Design system + conventions — read before writing UI code
  src/
    index.css        Tailwind @theme tokens, @layer components, base resets
    lib/api.ts       All HTTP calls to the API
    data/            Hooks that wrap lib/api and map API shapes to UI shapes
    pages/           One folder per route, with a sections/ subfolder
    components/      Shared components
Backend/
  src/
    index.ts              Express entry point, route + static mounts
    routes/               Thin URL wiring
    controllers/          Request handling
    models/               Prisma data access
    views/                Response shaping (JSON serialisers)
    lib/prisma.ts         Shared Prisma client
    lib/media.ts          Maps DB-relative image paths to /media URLs
  prisma/
    schema.prisma         Data model (Boat, BoatImage, Seller, BlogPost)
    migrations/           Generated SQL migrations
    seed-data/            JSON source data for the seed scripts
bb-blogs/                 Blog header images, one folder per post
boat brokers product images/   Boat photos
docker-compose.yml        Local MySQL service
```

---

## Blog system

Blog content was migrated from a Word document and now lives in MySQL. The whole chain,
source → database → API → page, is described below.

### Content source and the extraction pipeline

- **Source document:** `TheBoatBrokers_Blogs (1).docx` in the repo root — 62 posts, each
  delimited by a `BLOG NN` heading.
- **Header images:** `bb-blogs/NN-<slug>/header.{jpg,png}`. The folder name after the
  numeric prefix **is** the post's slug.

A script converts the `.docx` into HTML and writes `Backend/prisma/seed-data/blogs.json`,
which `node prisma/seed-blogs.js` then upserts **by slug** (so re-running never duplicates
rows or breaks `/blog/:slug` URLs).

Three things the extraction has to get right — earlier versions got them wrong and the
pages rendered badly:

1. **Walk `<w:body>` children in document order**, matching
   `/<w:tbl>[\s\S]*?<\/w:tbl>|<w:p\b[^>]*>[\s\S]*?<\/w:p>/g`. A flat paragraph-only regex
   sweeps up the 558 paragraphs living *inside* the 26 Word tables and emits them as
   stray one-line `<p>` blocks — which is what turned comparison tables into vertical
   lists of fragments.
2. **Normalise heading depth per post, not globally.** Posts disagree about which Word
   style means "top-level section": 32 use only `Heading2`, 21 use `Heading1`+`Heading2`,
   7 use only `Heading1`, 2 use only `Heading3`. Mapping styles to tags globally renders
   the same semantic level at three different sizes across posts. Instead, rank the
   heading styles *that post actually uses*, shallowest first, and map them onto
   `h2` → `h3` → `h4`. The page title is the `<h1>`, so body headings start at `h2`.
3. **Emit `data-label` on every `<td>`**, carrying that column's header text. The mobile
   table layout needs it (CSS can't read another element's text).

### Database

`BlogPost` in `prisma/schema.prisma`:

| Column | Notes |
|---|---|
| `slug` | unique; drives `/blog/:slug` and matches the `bb-blogs/` folder name |
| `title`, `author`, `date`, `readTime` | `date` and `readTime` are display strings, not typed values |
| `content` | raw HTML, rendered as-is |
| `imageUrl` | repo-relative, e.g. `bb-blogs/01-.../header.jpg` |

Image paths are stored repo-relative and converted to URLs at serialise time by
`toBlogMediaUrl()` in `lib/media.ts`; `bb-blogs/` is mounted statically at `/media/blogs`
in `index.ts`. This mirrors how boat images work.

### API (MVC)

`GET /api/blogs` and `GET /api/blogs/:slug`, wired as:

```
routes/blogs.ts  →  controllers/blogPost.controller.ts  →  models/blogPost.model.ts
                                     ↓
                         views/blogPost.view.ts
```

The **view layer** is what differs per endpoint: the list returns a light summary with a
generated `excerpt` and **no** `content`; the detail endpoint returns the full HTML.

### Frontend

```
lib/api.ts                    fetchBlogPosts() / fetchBlogPost(slug)
  ↓
data/blogPosts.ts             useBlogPosts()        — list, module-level cache
data/blogPostDetail.ts        useBlogPostBySlug()   — single post
  ↓
pages/Blog/.../BlogListing.tsx          the /blog listing
pages/BlogDetail/BlogDetail.tsx         the /blog/:slug page
pages/BlogDetail/.../BlogDetailRelated  "Related Reading" cards
```

`BlogDetailContent.tsx` does **not** call the API — it receives the fetched post as a prop.

### Article typography — `.article-prose`

Post bodies are injected with `dangerouslySetInnerHTML`, so the elements can't carry
utility classes. Styling lives in a single `.article-prose` class in the
`@layer components` block of `Frontend/src/index.css`.

**It must stay in `@layer components`.** The base layer resets `ul { list-style: none }`,
`a { text-decoration: none }` and `h1–h6 { font-weight: 400 }`; a components-layer rule
overrides those by cascade-layer order rather than by specificity or stylesheet order.
Inline `[&_x]:` utilities lose that fight unpredictably, and can't express descendant
rules like `thead th` or `td::before`.

Two details worth knowing before changing it:

- **Tables** are labelled cards on mobile (`thead` hidden, each row a bordered card,
  `td::before { content: attr(data-label) }`) and a real table from `sm:` up. Nothing
  scrolls sideways at any width.
- **Heading sizes step down below `sm:`.** The `text-h1`–`text-h4` tokens all clamp to the
  same `1.75rem` floor, so an `h2` and `h3` would both render at 28px on a phone and the
  hierarchy would vanish. `h3`/`h4` drop a token at mobile. Resulting ladder: 28/24/14 on
  mobile, 38/34/18 on desktop.

Keep `.article-prose` on the injected-HTML element only — its bare `a`/`strong` rules
would otherwise capture the sibling CTA and FAQ markup in the same component.

### Only 5 posts are listed publicly

`findAllBlogPosts()` in `models/blogPost.model.ts` has `take: PUBLIC_POST_LIMIT` (5),
ordered by `id` ascending — the first five posts from the source document.

- All **62 rows remain in the database**; nothing is deleted.
- `findBlogPostBySlug()` is untouched, so **direct `/blog/:slug` links still work for all
  62 posts** — they're hidden from the listing, not access-controlled.
- "Related Reading" draws from the same list endpoint, so it also only surfaces those 5.

To list everything again, remove the `take`. To change the count, change the constant.
If you later need to hand-pick which posts are public rather than "the first N", that's
the point at which an `isPublished` boolean column earns its migration.

### Known gaps

- **16 of the 62 header images are too small for a full-width hero** — as small as
  255×304, upscaled up to 3× at desktop widths, which makes them look soft. The banner
  crops to a fixed band and clicking opens the uncropped photo in a lightbox, but the
  lightbox can't invent pixels: for those 16 the "full view" is barely larger than the
  banner. Only replacing the source files in `bb-blogs/NN-*/` fixes this.
- **Body text runs ~144 characters per line at 1440px.** The article container was
  widened to align with the image banner; comfortable reading is usually 45–85 characters.
  Fine on mobile and tablet, wide on desktop.
- **The `.docx` → JSON extraction script is not in the repo.** It was run from a scratch
  directory, so `seed-data/blogs.json` is currently the only committed artifact of it.
  If the source document changes, that script needs to be recovered or rewritten — worth
  committing under `Backend/prisma/` before that happens.
- **Post HTML is not sanitised.** It comes from a trusted document and is rendered with
  `dangerouslySetInnerHTML`. If this path ever accepts untrusted admin input, it needs
  sanitising (e.g. DOMPurify) first.

---

## Notes

- Prisma is pinned to the last stable 6.x release. `prisma@latest`/`@prisma/client@latest`
  currently resolve to an 8.0 release candidate with a different CLI and config format
  (driver adapters + `prisma.config.ts`) — don't upgrade past 6.x without adopting that
  new setup deliberately.
- Regenerating the Prisma client fails with `EPERM` on Windows while the API dev server is
  running — it holds the query-engine DLL open. Stop `npm run dev` first.
- The MySQL container publishes on host port **3307**, not 3306, because another local
  project's database container was already bound to 3306.
- `Frontend/CLAUDE.md` is the authority on UI conventions (design tokens, breakpoints,
  component patterns). Read it before writing frontend code.
