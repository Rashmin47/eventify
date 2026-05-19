import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { updateEventAction } from "@/lib/actions/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function toDateTimeLocalInput(value: Date | null) {
  if (!value) {
    return "";
  }

  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const row = await prisma.event.findFirst({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      maxAttendees: true,
      createdAt: true,
      eventRsvps: {
        select: { id: true },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const updateEventForId = updateEventAction.bind(null, row.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative overflow-hidden rounded-4xl border border-border bg-card p-8 shadow-sm">
        <div className="relative space-y-6">
          <Badge className="w-fit border border-border bg-muted/30 text-muted-foreground">
            Edit event
          </Badge>
          <div className="space-y-4">
            <h1 className="font-display text-4xl tracking-tight">
              Keep the event current as plans change.
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Update the title, schedule, venue, or capacity without losing the
              invite link or guest list.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <CalendarDays className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">Created</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                }).format(row.createdAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <MapPin className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">Venue</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {row.location || "No location set"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <Users className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">RSVPs</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {row.eventRsvps.length} recorded response
                {row.eventRsvps.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href={`/events/${row.id}`}>
              <ArrowRight className="size-4 rotate-180" />
              Back to event
            </Link>
          </Button>
        </div>
      </section>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Edit details
          </Badge>
          <CardTitle className="text-2xl">Update the host view</CardTitle>
          <CardDescription>
            Changes apply immediately and the invite link keeps working.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={updateEventForId}>
            <FormField>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={row.title}
                placeholder="Team dinner, launch party, workshop..."
              />
            </FormField>

            <FormField>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={row.description}
                placeholder="Optional details, agenda, dress code, or notes for guests."
                className="min-h-32"
              />
              <FormMessage>
                Use this for anything guests need to know before they RSVP.
              </FormMessage>
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={row.location}
                  placeholder="The Studio, Brooklyn"
                />
              </FormField>
              <FormField>
                <Label htmlFor="eventDate">Date and time</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                  defaultValue={toDateTimeLocalInput(row.eventDate)}
                />
                <FormMessage>
                  Leave it blank if you want to publish details later.
                </FormMessage>
              </FormField>
            </div>

            <FormField>
              <Label htmlFor="maxAttendees">Capacity</Label>
              <Input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                min={1}
                max={100000}
                defaultValue={row.maxAttendees ?? ""}
                placeholder="Optional attendee cap"
              />
              <FormMessage>
                Leave empty for an unlimited guest list.
              </FormMessage>
            </FormField>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/events/${row.id}`}>Cancel</Link>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
