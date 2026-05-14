import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";

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
      invite: { select: { token: true } },
      rsvps: { select: { status: true } },
    },
  });
  if (!row) {
    notFound();
  }
  const counts = countByStatus(row.rsvps);
  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    inviteToken: row.invite?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount,
  };

  const createEventActionForEvent = createInviteLinkAction.bind(null, event.id);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            {event.eventDate
              ? new Date(event.eventDate).toLocaleString()
              : "No date selected"}
            {event.location ? `-${event.location}` : ""}
          </p>
          {event.description && <p>{event.description}</p>}
        </div>
        <Button asChild variant={"outline"}>
          <Link href={"/dashboard"}>Back</Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>Going: {event.goingCount} </Badge>
        <Badge variant="secondary">Maybe: {event.maybeCount} </Badge>
        <Badge variant="outline" /> Not Going: {event.notGoingCount}
      </div>
      <Card>
        <CardHeader>Invite Link</CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            Share this link with guests so they can RSVP without creating an
            account.
          </p>
          <Form action={createInviteActionForEvent}>
            <Button>Generate Link</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
