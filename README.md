# GlobeTrotter

Travel planning app — Next.js 16 · Drizzle · PostgreSQL · Better Auth.

## Getting Started

```bash
cp .env.example .env   # set a BETTER_AUTH_SECRET
docker compose up -d   # starts Postgres on port 5434
npm install
npm run db:push        # creates all tables
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema changes to the DB |
| `npm run db:studio` | Browse data in Drizzle Studio |
| `npx tsx scripts/db-roundtrip.ts` | DB smoke test |

## Workflow

Branch → PR → code review → merge to `main`. npm only, no pnpm/yarn/bun.
