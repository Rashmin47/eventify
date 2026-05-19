import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";

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

const serif = Source_Serif_4({
  variable: "--font-serif",
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
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NeonAuthUIProvider authClient={authClient} defaultTheme="light">
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold tracking-[0.24em] text-foreground">
                  EV
                </span>
                <span className="flex flex-col leading-none">
                  <span className="font-display text-lg tracking-tight">
                    Eventify
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Events and RSVPs in one place
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
                <UserButton size="icon" />
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 lg:px-6">
            {children}
          </main>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
