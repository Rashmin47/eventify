import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { createEventAction } from "@/lib/actions/events";
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

const creationTips = [
  "Add a clear title so guests know what they are RSVPing to.",
  "Use the invite link after saving to share a private RSVP flow.",
  "You can leave date, location, or description blank and fill them later.",
];

export default function NewEventPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-8 shadow-2xl shadow-black/10 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_24%)]" />
        <div className="relative space-y-6">
          <Badge className="w-fit border border-white/10 bg-white/5 text-foreground">
            <Sparkles className="mr-2 size-3.5" />
            New event workflow
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">
              Create a thoughtful event page in a few minutes.
            </h1>
            <p className="text-muted-foreground">
              Start with the essentials, then add the invite link and guest list
              once the event is live.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <CalendarDays className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">Date</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Optional until you are ready.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <MapPin className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">
                Location
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep it flexible or use a precise venue.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <Users className="mb-3 size-5 text-primary" />
              <div className="text-sm font-medium text-foreground">RSVPs</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Track every response in one dashboard.
              </p>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowRight className="size-4 rotate-180" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </section>

      <Card className="border-border/70 bg-surface/80 shadow-xl shadow-black/10 backdrop-blur">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Event details
          </Badge>
          <CardTitle className="text-2xl">Fill out the basics</CardTitle>
          <CardDescription>
            This form creates the event and takes you straight to the invite
            link screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={createEventAction}>
            <FormField>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Team dinner, launch party, workshop..."
              />
            </FormField>

            <FormField>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Optional details, agenda, dress code, or notes for guests."
                className="min-h-32"
              />
              <FormMessage>
                A good description helps guests decide quickly.
              </FormMessage>
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="The Studio, Brooklyn"
                />
              </FormField>
              <FormField>
                <Label htmlFor="eventDate">Date and time</Label>
                <Input id="eventDate" name="eventDate" type="datetime-local" />
                <FormMessage>
                  Optional for now. You can set or update it later.
                </FormMessage>
              </FormField>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="size-4 text-primary" />
                Tips before you publish
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {creationTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit">Create event</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
