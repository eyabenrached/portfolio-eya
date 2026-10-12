import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { serverApi } from "@/lib/server-api";

export const metadata = { title: "Connexion — Admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  let loggedIn = false;
  try {
    await serverApi("/auth/me");
    loggedIn = true;
  } catch {
    /* non connecté (ou cookie expiré) : on affiche le formulaire */
  }
  if (loggedIn) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <LoginForm />
    </main>
  );
}
