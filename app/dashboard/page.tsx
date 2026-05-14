import {
  DashboardContent,
  type DashboardView,
} from "@/components/dashboard-content";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string }>;
}) {
  const session = await getSession();

  if (!session.data?.user?.id) {
    redirect("/auth/sign-in");
  }

  const query = await searchParams;
  const view: DashboardView =
    query.view === "upcoming" || query.view === "past" ? query.view : "all";

  return (
    <DashboardContent
      userId={session.data.user.id}
      query={query.q ?? ""}
      view={view}
    />
  );
}
