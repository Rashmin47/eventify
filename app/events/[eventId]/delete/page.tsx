import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Sparkles,
  Trash2,
} from "lucide-react";

import { deleteEventAction } from "@/lib/actions/events";
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
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DeleteEventPage({
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
      createdAt: true,
      eventDate: true,
      eventRsvps: {
        select: { id: true },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const deleteEventForId = deleteEventAction.bind(null, row.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative overflow-hidden rounded-3xl border border-destructive/30 bg-destructive/10 p-8 shadow-sm">
        <div className="relative space-y-6">
          <Badge className="w-fit border border-destructive/30 bg-destructive/10 text-destructive">
            Delete event
          </Badge>
          <div className="space-y-4">
            <h1 className="font-display text-4xl tracking-tight">
              Remove {row.title} from your workspace.
            </h1>
            <p className="max-w-xl text-muted-foreground">
              This permanently deletes the event, invite, and RSVP records.
              There is no undo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <CalendarDays className="mb-3 size-5 text-destructive" />
              <div className="text-sm font-medium text-foreground">Created</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                }).format(row.createdAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <AlertTriangle className="mb-3 size-5 text-destructive" />
              <div className="text-sm font-medium text-foreground">
                Responses
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {row.eventRsvps.length} response
                {row.eventRsvps.length === 1 ? "" : "s"} will be removed
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
          <Badge variant="destructive" className="w-fit">
            Dangerous action
          </Badge>
          <CardTitle className="text-2xl">Confirm deletion</CardTitle>
          <CardDescription>
            Type the exact event title to confirm you want to delete it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={deleteEventForId} className="space-y-5">
            <FormField>
              <Label htmlFor="confirmTitle">Event title</Label>
              <Input
                id="confirmTitle"
                name="confirmTitle"
                required
                placeholder={row.title}
              />
              <FormMessage>
                Enter “{row.title}” exactly as shown above.
              </FormMessage>
            </FormField>

            <div className="rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">
              Deleting this event removes its invite page and all guest
              responses from the dashboard.
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button type="submit" variant="destructive">
                <Trash2 className="size-4" />
                Delete event
              </Button>
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
