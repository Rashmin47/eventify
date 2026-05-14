import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Link2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import type { RSVPStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { prisma } from "@/lib/prisma";

export type DashboardView = "all" | "upcoming" | "past";

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;

  for (const r of rsvps) {
    if (r.status === "GOING") goingCount += 1;
    else if (r.status === "MAYBE") maybeCount += 1;
    else if (r.status === "NOT_GOING") notGoingCount += 1;
  }

  return { goingCount, maybeCount, notGoingCount };
}

type DashboardEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string | null;
  createdAt: string;
  location: string;
  inviteToken: string | null;
  inviteUrl: string | null;
  goingCount: number;
  maybeCount: number;
  notGoingCount: number;
  responseCount: number;
  isPast: boolean;
  dateLabel: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildResponseShare(event: DashboardEvent) {
  if (event.responseCount === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((event.goingCount / event.responseCount) * 100),
  );
}

function statusBadgeClass(isPast: boolean) {
  return isPast
    ? "border-amber-500/25 bg-amber-500/10 text-amber-100"
    : "border-emerald-500/25 bg-emerald-500/10 text-emerald-100";
}

export async function DashboardContent({
  userId,
  query,
  view,
}: {
  userId: string;
  query: string;
  view: DashboardView;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const rows = await prisma.event.findMany({
    where: { ownerUserId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      eventDate: true,
      location: true,
      createdAt: true,
      invite: { select: { token: true } },
      eventRsvps: { select: { status: true } },
    },
  });

  const now = Date.now();
  const events: DashboardEvent[] = rows
    .map((event) => {
      const date = event.eventDate ? event.eventDate.toISOString() : null;
      const counts = countByStatus(event.eventRsvps);
      const inviteToken = event.invite?.token ?? null;
      const inviteUrl = inviteToken ? `${baseUrl}/invite/${inviteToken}` : null;
      const isPast = event.eventDate ? event.eventDate.getTime() < now : false;

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: date,
        createdAt: event.createdAt.toISOString(),
        location: event.location,
        inviteToken,
        inviteUrl,
        goingCount: counts.goingCount,
        maybeCount: counts.maybeCount,
        notGoingCount: counts.notGoingCount,
        responseCount:
          counts.goingCount + counts.maybeCount + counts.notGoingCount,
        isPast,
        dateLabel: date ? formatDate(date) : "Date not set",
      };
    })
    .filter((event) => {
      const search = query.trim().toLowerCase();
      const haystack = [
        event.title,
        event.description,
        event.location,
        event.dateLabel,
      ]
        .join(" ")
        .toLowerCase();

      if (search && !haystack.includes(search)) {
        return false;
      }

      if (view === "upcoming") {
        return !event.isPast;
      }

      if (view === "past") {
        return event.isPast;
      }

      return true;
    })
    .sort((left, right) => {
      const leftDate = left.eventDate
        ? Date.parse(left.eventDate)
        : Number.POSITIVE_INFINITY;
      const rightDate = right.eventDate
        ? Date.parse(right.eventDate)
        : Number.POSITIVE_INFINITY;

      if (leftDate !== rightDate) {
        return leftDate - rightDate;
      }

      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    });

  const totalResponses = events.reduce(
    (sum, event) => sum + event.responseCount,
    0,
  );
  const inviteReadyCount = events.filter((event) =>
    Boolean(event.inviteUrl),
  ).length;
  const upcomingCount = events.filter((event) => !event.isPast).length;
  const nextEvent = events.find((event) => !event.isPast) ?? events[0] ?? null;
  const hasFilters = Boolean(query.trim()) || view !== "all";

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-8 shadow-2xl shadow-black/15 backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_26%)]" />
          <div className="relative space-y-6">
            <Badge className="w-fit border border-white/10 bg-white/5 text-foreground">
              <Sparkles className="mr-2 size-3.5" />
              Your event command center
            </Badge>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Keep every invite, RSVP, and guest list in one clear view.
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                Search events, copy invite links, and see response momentum
                without leaving the dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/events/new">Create event</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Refresh list</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <CalendarDays className="mb-3 size-5 text-primary" />
                <div className="text-2xl font-semibold">{events.length}</div>
                <div className="text-sm text-muted-foreground">
                  Events shown
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <Users className="mb-3 size-5 text-primary" />
                <div className="text-2xl font-semibold">{totalResponses}</div>
                <div className="text-sm text-muted-foreground">Total RSVPs</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <Link2 className="mb-3 size-5 text-primary" />
                <div className="text-2xl font-semibold">{inviteReadyCount}</div>
                <div className="text-sm text-muted-foreground">
                  Invite links
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
            <CardHeader>
              <CardDescription>Next up</CardDescription>
              <CardTitle className="text-2xl">
                {nextEvent ? nextEvent.title : "No events match this view"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {nextEvent ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge className={statusBadgeClass(nextEvent.isPast)}>
                      {nextEvent.isPast ? "Past" : "Upcoming"}
                    </Badge>
                    <Badge variant="outline">
                      {nextEvent.responseCount} response
                      {nextEvent.responseCount === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock3 className="size-4 text-primary" />
                      {nextEvent.dateLabel}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      {nextEvent.location || "No location set"}
                    </div>
                  </div>
                  <p>{nextEvent.description || "No description added yet."}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" asChild>
                      <Link href={`/events/${nextEvent.id}`}>
                        Open event
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    {nextEvent.inviteUrl ? (
                      <CopyButton
                        value={nextEvent.inviteUrl}
                        label="Copy invite"
                      />
                    ) : null}
                  </div>
                </>
              ) : (
                <p>
                  Create a new event or loosen the filters to see your upcoming
                  work.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
            <CardHeader>
              <CardDescription>Search and filter</CardDescription>
              <CardTitle>Find the right event quickly</CardTitle>
            </CardHeader>
            <CardContent>
              <form method="get" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="q">Search</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="q"
                      name="q"
                      defaultValue={query}
                      placeholder="Search by title, location, or date"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view">View</Label>
                  <select
                    id="view"
                    name="view"
                    defaultValue={view}
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  >
                    <option value="all">All events</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Apply filters</Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Clear</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Events</h2>
            <p className="text-sm text-muted-foreground">
              Showing {events.length} of {rows.length} event
              {rows.length === 1 ? "" : "s"}.
            </p>
          </div>
          {hasFilters ? (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Reset filters</Link>
            </Button>
          ) : null}
        </div>

        {events.length === 0 ? (
          <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
            <CardHeader>
              <CardTitle>No events found</CardTitle>
              <CardDescription>
                Try another search or create a new event to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/events/new">Create event</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Reset filters</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {events.map((event) => {
              const responseShare = buildResponseShare(event);

              return (
                <Card
                  key={event.id}
                  className="border-border/70 bg-surface/80 shadow-lg shadow-black/10 backdrop-blur"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-xl">
                            {event.title}
                          </CardTitle>
                          <Badge className={statusBadgeClass(event.isPast)}>
                            {event.isPast ? "Past" : "Upcoming"}
                          </Badge>
                        </div>
                        <CardDescription>
                          {event.dateLabel}
                          {event.location ? ` • ${event.location}` : ""}
                        </CardDescription>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/events/${event.id}`}>
                          Open
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {event.description || "No description added yet."}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Going
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                          {event.goingCount}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Maybe
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                          {event.maybeCount}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Not going
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                          {event.notGoingCount}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Going share</span>
                        <span>{responseShare}% of responses</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${responseShare}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">
                        {event.responseCount} response
                        {event.responseCount === 1 ? "" : "s"}
                      </Badge>
                      <Badge variant="outline">
                        Created {formatDate(event.createdAt)}
                      </Badge>
                      {event.inviteUrl ? (
                        <Badge className="border-primary/20 bg-primary/10 text-primary">
                          Invite ready
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Generate invite later</Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-black/10">
                    <div className="text-xs text-muted-foreground">
                      {event.inviteUrl
                        ? "Guests can RSVP with this link."
                        : "Open the event to generate an invite link."}
                    </div>
                    {event.inviteUrl ? (
                      <CopyButton value={event.inviteUrl} label="Copy invite" />
                    ) : (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}`}>Set up invite</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
