import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

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
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-8 shadow-2xl shadow-black/15 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_24%)]" />
        <div className="relative space-y-6">
          <Badge className="w-fit border border-white/10 bg-white/5 text-foreground">
            <Sparkles className="mr-2 size-3.5" />
            Secure account access
          </Badge>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Sign in once and manage every invite from the same place.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Eventify uses Neon Auth to keep your event workspace and guest
              sessions in sync without extra boilerplate.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {authPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-foreground/90"
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

      <section className="rounded-[2rem] border border-border/70 bg-background/70 p-4 shadow-xl shadow-black/10 backdrop-blur">
        <Card className="border-border/70 bg-surface/80 p-0 shadow-none">
          <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4">
            <AuthView path={path} />
          </div>
        </Card>
      </section>
    </main>
  );
}
