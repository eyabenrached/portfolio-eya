import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import AdminShell from "@/components/admin/AdminShell";
import { serverApi } from "@/lib/server-api";
import type { AdminUser } from "@/types";

export const metadata = { title: "Dashboard — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Vérification réelle de la session côté serveur (le backend contrôle signature + expiration du JWT)
  let user: AdminUser | null = null;
  try {
    user = await serverApi<AdminUser>("/auth/me");
  } catch {
    user = null;
  }
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
