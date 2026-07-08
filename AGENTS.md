<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# katalog-toko

Simple Next.js 16 App Router site (not a monorepo).

## Stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | Next.js 16.2.10 | App Router (`src/app/` dir) |
| Language | TypeScript 5 | Strict mode, `@/*` → `./src/*` |
| Styling | Tailwind CSS 4 | PostCSS via `@tailwindcss/postcss` |
| ORM | Prisma 7 | SQLite via `better-sqlite3`, output at `src/generated/prisma/client` |
| Auth | Custom JWT | `jose` for signing, stored in httpOnly cookie |
| Linting | ESLint 9 flat config | `eslint.config.mjs` with `eslint-config-next` |
| Forms | react-hook-form + Zod 4 | `@hookform/resolvers` |
| Notifications | react-hot-toast | |
| Package manager | npm | lockfile: `package-lock.json` |
| Testing | **None configured** | No test framework or runner installed |
| Formatting | **None configured** | No Prettier or formatter setup |
| CI/CD | None | No GitHub Actions workflows |

## Commands

```sh
npm run dev           # dev server
npm run build         # prisma generate + production build
npm run start         # start production server
npm run lint          # ESLint (flat config, v9)
npm run db:generate   # regenerate Prisma client
npm run db:push       # push schema to SQLite
npm run db:seed       # run seed script
```

## Key architectural notes

- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** — the file is `src/proxy.ts`, exports a named `proxy` function.
- **Prisma 7 breaking changes** — `prisma.config.ts` at root holds datasource config; schema uses `provider = "prisma-client"` with explicit `output`; `PrismaClient` requires a driver adapter (`@prisma/adapter-better-sqlite3`). Model types import from `@/generated/prisma/client`, not `@prisma/client`.
- **Tailwind v4** — no `tailwind.config.js`; use `@theme` in CSS and `@import "tailwindcss"` instead of `@tailwind` directives.
- **ESLint flat config** — `eslint.config.mjs`, not `.eslintrc.*`.
- **No tests** — any new feature must pick its test framework from scratch.
- **No Prettier** — lint is the only style gate.

## Authentication

Simple JWT auth using `jose`. Login at `POST /api/auth/login` sets an httpOnly cookie named `session`. The `proxy.ts` protects `/admin/*` routes (except login). Logout at `GET /api/auth/logout`. Default credentials after seeding: `admin` / `admin123`.

## Database

SQLite file at `prisma/dev.db`. Seed data includes 4 categories + 8 products. Admin login is seeded during `npm run db:seed`.
