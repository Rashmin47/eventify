# Eventify

Eventify is an invite-driven event planning app built with Next.js (App Router), Prisma, Neon Auth, Tailwind CSS, and a small shadcn-style component library. It focuses on creating events, issuing invite links, and collecting invite-based RSVPs from guests (the "invite RSVP" workflow).

Key features

- Create events with date/time, description, and location
- Generate shareable invite links for guests (copy-to-clipboard helper)
- Track invite responses (Going / Maybe / Not going) and guest lists
- Auth via Neon Auth (proxy route under `/api/auth`) for sign-in/sign-up
- Server actions for creating events, invites, and submitting RSVP responses
- Clean, responsive UI using Tailwind + small UI primitives

Tech stack

- Next.js 16 (App Router)
- TypeScript
- Prisma (Postgres) + Neon
- Tailwind CSS + shadcn-style components
- Neon Auth for authentication and session management

Getting started (local)
Prerequisites

- Node.js 18+ recommended
- A PostgreSQL-compatible database (Neon or local Postgres)

Setup

1. Copy `.env.example` to `.env` and set these values:
   - `DATABASE_URL` — Postgres connection string
   - `NEON_AUTH_BASE_URL` — Neon Auth endpoint base URL
   - `NEON_AUTH_COOKIE_SECRET` — a secure random string used for auth cookies
   - `NEXT_PUBLIC_APP_URL` — e.g. `http://localhost:3000`

2. Install dependencies:

```bash
npm install
# or pnpm install
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Apply or reset the database migrations (development):

```bash
# create a migration and apply locally
npx prisma migrate dev --name init

# or, if you need to reset the DB (destructive):
npx prisma migrate reset
```

5. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

Build for production

```bash
npm run build
npm run start
```

Key files and locations

- App routes and pages: `app/`
- Reusable UI components: `components/` (dashboard-content, event-detail-content, invite-rsvp-content, copy-button)
- Server actions and business logic: `lib/actions/events.ts`
- Prisma schema and migrations: `prisma/`
- Auth server instance: `lib/auth/server.ts`

Notes & common issues

- Neon Auth (deployed): If you see `403` on `/api/auth/sign-in/email` or `/api/auth/sign-up/email` in production, this is often caused by Neon Console settings (trusted origins / allowed redirect URLs / email provider settings). The app's proxy route is correct; verify Neon Console configuration for your environment.
- Prisma model drift: Keep `prisma/schema.prisma`, `migrations/`, and the app relations in sync. Run `npx prisma generate` whenever schema changes.
- Redirects inside server actions: avoid swallowing `redirect()` calls inside `try/catch` without re-throwing — you may lose navigation behavior.

Improvement ideas (quick wins)

- Add event edit/delete UI and server actions
- Improve the auth error UX to display Neon rejection reasons to users
- Add email reminders or calendar integration for invited guests
- Add unit/integration tests for server actions and key components
- Accessibility audit (aria attributes, keyboard navigation, color contrast)
- Add analytics/usage dashboard for event organizers

Contributing

- Branch from `main` and open a PR with a clear description
- Run `npm run build` locally to confirm no compile errors
- If you modify Prisma models, include migration steps and run `npx prisma generate`

If you want me to implement UI improvements, tell me which page to start with (dashboard, event detail, invite RSVP page) and whether you prefer a minimal style refresh or a full redesign.
