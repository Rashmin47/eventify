import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Link2,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { createInviteLinkAction } from "@/lib/actions/events";
import { CopyButton } from "./copy-button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
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
import { Form } from "./ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function formatRsvpStatus(status: string) {
  if (status === "NOT_GOING") return "Not going";
  if (status === "GOING") return "Going";
  return "Maybe";
}

function statusBadgeClass(status: string) {
  if (status === "GOING") {
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-100";
  }

  if (status === "MAYBE") {
    return "border-amber-500/25 bg-amber-500/10 text-amber-100";
  }

  return "border-rose-500/25 bg-rose-500/10 text-rose-100";
}

export async function EventDetailContent({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) {
  const row = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      createdAt: true,
      invite: { select: { token: true } },
      eventRsvps: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          respondedAt: true,
        },
        orderBy: { respondedAt: "desc" },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const counts = countByStatus(row.eventRsvps);
  const responseTotal =
    counts.goingCount + counts.maybeCount + counts.notGoingCount;
  const responseShare = responseTotal
    ? Math.min(100, Math.round((counts.goingCount / responseTotal) * 100))
    : 0;
  const eventDate = row.eventDate ? row.eventDate.toISOString() : null;
  const inviteUrl = row.invite?.token
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${row.invite.token}`
    : null;
  const generateInviteActionForEvent = createInviteLinkAction.bind(
    null,
    row.id,
  );
  const dateLabel = eventDate
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(eventDate))
    : "No date selected";

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-border/70 bg-surface/80 shadow-2xl shadow-black/10 backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge className="border border-white/10 bg-white/5 text-foreground">
                <Sparkles className="mr-2 size-3.5" />
                Event overview
              </Badge>
              <Badge variant="outline">
                Created{" "}
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                }).format(new Date(row.createdAt))}
              </Badge>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl md:text-4xl">
                {row.title}
              </CardTitle>
              <CardDescription className="text-base">
                {row.description || "No description added yet."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <Clock3 className="mb-3 size-5 text-primary" />
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Date
                </div>
                <p className="mt-2 text-sm text-foreground">{dateLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <MapPin className="mb-3 size-5 text-primary" />
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Location
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {row.location || "No location set"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <Users className="mb-3 size-5 text-primary" />
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Responses
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {responseTotal} response{responseTotal === 1 ? "" : "s"}
                </p>
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
              <Badge className="border-emerald-500/25 bg-emerald-500/10 text-emerald-100">
                Going: {counts.goingCount}
              </Badge>
              <Badge className="border-amber-500/25 bg-amber-500/10 text-amber-100">
                Maybe: {counts.maybeCount}
              </Badge>
              <Badge className="border-rose-500/25 bg-rose-500/10 text-rose-100">
                Not going: {counts.notGoingCount}
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-3 border-t border-white/5 bg-black/10">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                Back to dashboard
                <ArrowRight className="size-4 rotate-180" />
              </Link>
            </Button>
            {inviteUrl ? (
              <CopyButton value={inviteUrl} label="Copy invite" />
            ) : (
              <Form action={generateInviteActionForEvent}>
                <Button type="submit">Generate invite</Button>
              </Form>
            )}
          </CardFooter>
        </Card>

        <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
          <CardHeader>
            <CardDescription>Invite status</CardDescription>
            <CardTitle className="text-2xl">Share the RSVP link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Guests can RSVP without creating an account. When the invite is
              ready, copy the link below and send it anywhere.
            </p>
            {inviteUrl ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-foreground">
                  {inviteUrl}
                </div>
                <div className="flex flex-wrap gap-3">
                  <CopyButton value={inviteUrl} label="Copy link" />
                  <Button variant="outline" asChild>
                    <Link href={inviteUrl} target="_blank" rel="noreferrer">
                      Open invite
                      <Link2 className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-4">
                <p className="text-foreground">No invite link generated yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Generate one to start collecting responses from guests.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
        <CardHeader>
          <CardDescription>Guest list</CardDescription>
          <CardTitle>Recent responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {row.eventRsvps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-6 text-sm text-muted-foreground">
              No responses yet. Share the invite link and the first RSVP will
              appear here.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {row.eventRsvps.map((rsvp) => (
                    <TableRow key={rsvp.id}>
                      <TableCell className="font-medium">{rsvp.name}</TableCell>
                      <TableCell>{rsvp.email}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeClass(rsvp.status)}>
                          {formatRsvpStatus(rsvp.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(rsvp.respondedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
