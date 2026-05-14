import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CalendarDays, Sparkles } from "lucide-react";

import { NeonAuthUIProvider, UserButton } from "@neondatabase/auth/react";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventify | Private invites and RSVPs",
  description:
    "Create events, share polished invite links, and track RSVPs in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NeonAuthUIProvider authClient={authClient} defaultTheme="dark">
          <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4">
              <Link href="/" className="group inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:-translate-y-0.5">
                  <Sparkles className="size-5" />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-lg font-semibold tracking-tight">
                    Eventify
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Private invites that feel polished
                  </span>
                </span>
              </Link>
              <nav className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/events/new">New event</Link>
                </Button>
                <span className="hidden items-center gap-1 rounded-full border border-border/70 bg-surface px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                  <CalendarDays className="size-3.5" />
                  RSVP hub
                </span>
                <UserButton size="icon" />
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 lg:px-6">
            {children}
          </main>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
