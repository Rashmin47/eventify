@AGENTS.md

## Purpose

This file gives context and instructions specifically for an assistant (Claude or other LLM agents) that will help maintain and improve Eventify. It augments the generic `AGENTS.md` guidance with codebase-specific notes, useful commands, and prioritized tasks.

## High-level project summary

- Eventify is an invite-based event management app: organizers create events and generate invite links; guests respond via those links.
- Key flows: create event -> generate invite link -> guest visits `/invite/[token]` -> submit RSVP -> organizer sees guest list and stats.

## Where to start (developer essentials)

- Inspect routes and pages under `app/` (landing in `app/page.tsx`, dashboard in `app/dashboard/page.tsx`, event pages in `app/events/[eventId]/page.tsx`, invite pages in `app/invite/[token]/page.tsx`).
- UI components live in `components/` (dashboard-content.tsx, event-detail-content.tsx, invite-rsvp-content.tsx, copy-button.tsx).
- Business logic and server actions: `lib/actions/events.ts`.
- Prisma schema & migrations: `prisma/schema.prisma` and `prisma/migrations/`.
- Auth: Neon Auth proxy at `app/api/auth/[...path]/route.ts` and server instance in `lib/auth/server.ts`.

## Common local commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Prisma generate: `npx prisma generate`
- Apply migrations (dev): `npx prisma migrate dev --name <name>`

## Important constraints & notes for the agent

- Do not change production Neon Console settings — the agent cannot access external consoles. Instead, surface instructions for the human operator when Neon Auth 403 issues appear.
- When editing Prisma models, always include `npx prisma generate` and add migration notes. Avoid destructive migration changes without discussion.
- Preserve existing UI tokens and Tailwind conventions; there are custom CSS tokens in `app/globals.css`.
- Keep server action semantics intact (they perform side effects and call `revalidatePath()` where needed).

## Suggested priority tasks for improvement

1. Improve UI starting points (pick one):
   - Dashboard: clearer list filters, better card layout, compact guest counts, responsive improvements.
   - Event detail: highlight RSVP breakdown, make invite link and copy actions more prominent.
   - Invite RSVP page: make form clearer, validate input, and show helpful success/next steps.

2. Add better auth error UX: capture Neon rejection messages and display them on the auth page.
3. Add edit/delete flows for events and invitations with confirmations.
4. Add tests for `lib/actions/events.ts` server actions (unit/integration where possible).

## How to report back

- When you make changes, run `npm run build` and include the tail output if there are errors.
- For UI changes, include screenshots or short GIFs and the file locations changed.
- For Prisma/schema changes, include the migration file name and instructions to apply it locally.

If you need clarification, ask the repo owner which UI screen to prioritize and whether they prefer incremental visual changes or a full redesign.
