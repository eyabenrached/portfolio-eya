"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Wrench,
  X,
} from "lucide-react";

import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import { messagesService } from "@/services/resources";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/skills", label: "Compétences", icon: Wrench },
  { href: "/admin/education", label: "Formation", icon: GraduationCap },
  { href: "/admin/experiences", label: "Expérience", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    messagesService
      .unreadCount()
      .then((r) => setUnread(r.count))
      .catch(() => undefined);
  }, [pathname]);

  async function logout() {
    try {
      await authService.logout();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="px-6 py-6 text-2xl font-bold text-slate-900 dark:text-white">
        Eya<span className="text-cyan-400">.</span>
        <span className="ml-2 text-sm font-medium text-slate-500">admin</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <Icon size={18} />
              {label}
              {href === "/admin/messages" && unread > 0 && (
                <span className="ml-auto rounded-full bg-cyan-500 px-2 py-0.5 text-xs text-white">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
        <p className="truncate text-xs text-slate-500" title={email}>
          {email}
        </p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={logout}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-400 hover:text-red-500 dark:border-slate-700 dark:text-slate-300"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Barre mobile */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        <Link href="/admin" className="text-xl font-bold text-slate-900 dark:text-white">
          Eya<span className="text-cyan-400">.</span> admin
        </Link>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="text-slate-800 dark:text-white"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white pt-0 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0",
          open ? "translate-x-0 pt-16" : "-translate-x-full lg:pt-0",
        )}
      >
        {sidebar}
      </aside>

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
