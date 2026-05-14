import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { submitOrUpdateRsvpAction } from "@/lib/actions/events";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function InviteRsvpContent({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) {
  const row = await prisma.eventInvite.findFirst({
    where: { token },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          eventDate: true,
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const event = {
    title: row.event.title,
    description: row.event.description,
    location: row.event.location,
    eventDate: row.event.eventDate ? row.event.eventDate.toISOString() : null,
  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);
  const dateLabel = event.eventDate
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(event.eventDate))
    : "No date selected";

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-8 shadow-2xl shadow-black/10 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_24%)]" />
        <div className="relative space-y-6">
          <Badge className="w-fit border border-white/10 bg-white/5 text-foreground">
            <Sparkles className="mr-2 size-3.5" />
            Private RSVP
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              RSVP for {event.title}
            </h1>
            <p className="text-muted-foreground">
              One response per email keeps the guest list tidy and lets people
              update their answer later.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <Clock3 className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">When</div>
              <p className="mt-1 text-sm text-muted-foreground">{dateLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <MapPin className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">Where</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {event.location || "Location not set"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 text-foreground">
              <Users className="size-4 text-primary" />
              What this link does
            </div>
            <p>
              Guests can RSVP without signing up. If they submit again with the
              same email, their response updates instead of duplicating.
            </p>
          </div>

          {event.description ? (
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 text-foreground">
                <Mail className="size-4 text-primary" />
                Event note
              </div>
              <p>{event.description}</p>
            </div>
          ) : null}
        </div>
      </section>

      <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            RSVP form
          </Badge>
          <CardTitle className="text-2xl">
            Tell the host you’re coming
          </CardTitle>
          <CardDescription>
            You can submit your answer now and update it later using the same
            email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4" />
                RSVP recorded
              </div>
              Thanks. Your response has been saved and the host can see it now.
            </div>
          ) : null}
          <Form action={submitRsvpForToken}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Your name" />
              </FormField>
              <FormField>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </FormField>
            </div>
            <FormField>
              <Label htmlFor="status">Attendance</Label>
              <select
                id="status"
                name="status"
                required
                defaultValue="GOING"
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
              >
                <option value="GOING">Going</option>
                <option value="MAYBE">Maybe</option>
                <option value="NOT_GOING">Not going</option>
              </select>
            </FormField>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
              Your RSVP updates immediately after submission.
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button type="submit">Submit RSVP</Button>
              <Button variant="outline" asChild>
                <Link href="/">Learn more about Eventify</Link>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
