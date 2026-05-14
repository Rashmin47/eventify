import { DashboardContent } from "@/components/dashboard-content";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.data?.user?.id) {
    redirect("/auth/sign-in");
  }

  return <DashboardContent userId={session.data.user.id} />;
}
