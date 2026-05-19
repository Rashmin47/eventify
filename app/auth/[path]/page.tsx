import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { AuthView, authViewPaths } from "@neondatabase/auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

const authPoints = [
  "Fast email sign-in and sign-up",
  "Works with invite-only event access",
  "Keeps your guest lists and sessions tidy",
];

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="relative space-y-6">
          <Badge className="w-fit border border-border bg-muted/30 text-muted-foreground">
            Account access
          </Badge>
          <div className="max-w-2xl space-y-4">
            <h1 className="font-display text-4xl tracking-tight md:text-6xl">
              Sign in once and keep every event in one workspace.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Use one account for creating events, sharing invite links, and
              checking RSVP changes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {authPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-foreground/90"
              >
                <ShieldCheck className="mb-3 size-5 text-primary" />
                {point}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back home
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Use {path === "sign-up" ? "sign-up" : "sign-in"} to continue.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        <Card className="border-border bg-card p-0 shadow-none">
          <div className="rounded-3xl border border-border bg-background/70 p-4">
            <AuthView path={path} />
          </div>
        </Card>
      </section>
    </main>
  );
}
