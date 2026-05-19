import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Link2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const highlights = [
  {
    title: "Private invite links",
    description: "Generate a unique RSVP URL for every event.",
    icon: Link2,
  },
  {
    title: "Real-time guest tracking",
    description: "See Going, Maybe, and Not Going totals at a glance.",
    icon: Users,
  },
  {
    title: "A calmer workflow",
    description: "A clean dashboard keeps the next action obvious.",
    icon: ShieldCheck,
  },
];

const steps = [
  "Create a polished event in seconds.",
  "Share an invite link with guests.",
  "Track responses and follow up fast.",
];

export default async function Home() {
  const { data: session } = await auth.getSession();
  const signedIn = Boolean(session?.user);
  const displayName = session?.user?.name ?? session?.user?.email ?? "there";

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="relative space-y-6">
            <Badge className="w-fit border border-border bg-muted/30 text-muted-foreground">
              Event management platform
            </Badge>
            <div className="max-w-2xl space-y-4">
              <h1 className="font-display text-4xl tracking-tight md:text-6xl">
                Plan events, share invites, and manage RSVPs without noise.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                A minimal host workspace for events that need a clean invite, a
                clear guest list, and a simple way to keep plans moving.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={signedIn ? "/events/new" : "/auth/sign-up"}>
                  {signedIn ? "Create event" : "Get started"}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
              {!signedIn ? (
                <Button variant="ghost" asChild>
                  <Link href="/auth/sign-in">Sign in</Link>
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="text-2xl font-semibold">3</div>
                <div className="text-sm text-muted-foreground">
                  Steps to launch
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="text-2xl font-semibold">1</div>
                <div className="text-sm text-muted-foreground">
                  Invite link per event
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="text-2xl font-semibold">0</div>
                <div className="text-sm text-muted-foreground">
                  Extra admin overhead
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardDescription>What you get</CardDescription>
              <CardTitle className="text-2xl">
                A focused planning hub for hosts and guests.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                {signedIn
                  ? `Welcome back, ${displayName}. Your dashboard is ready when you are.`
                  : "Create one account and keep every guest list, invite, and response in one place."}
              </p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-foreground/90">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardDescription>Built for real event work</CardDescription>
              <CardTitle>Useful even before your first RSVP lands.</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-muted/20 p-4"
                >
                  <item.icon className="mb-3 size-5 text-primary" />
                  <div className="font-medium text-foreground">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Create events</CardTitle>
            <CardDescription>
              Set title, date, location, and details in a single form.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Share invite links</CardTitle>
            <CardDescription>
              Generate a unique RSVP URL with one click.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Track attendance</CardTitle>
            <CardDescription>
              See attendee totals and response momentum at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Going, Maybe, and Not going stay visible wherever you need them.
          </CardContent>
        </Card>
      </section>

      {!signedIn ? (
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <Badge variant="secondary" className="w-fit">
                No account yet?
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight">
                Start with a clean event workspace and grow from there.
              </h2>
              <p className="text-muted-foreground">
                Sign up once and reuse Eventify for dinners, launches, team
                offsites, and any guest list you want to keep organized.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/auth/sign-up">
                  Create account <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
