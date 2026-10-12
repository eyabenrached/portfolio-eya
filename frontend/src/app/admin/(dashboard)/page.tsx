import Link from "next/link";
import { Briefcase, FolderKanban, GraduationCap, Mail, Wrench } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { serverApi } from "@/lib/server-api";
import type { EducationItem, ExperienceItem, Project, Skill } from "@/types";

async function count<T>(path: string): Promise<T[]> {
  try {
    return await serverApi<T[]>(path);
  } catch {
    return [];
  }
}

export default async function DashboardHome() {
  const [projects, skills, education, experiences, unread] = await Promise.all([
    count<Project>("/admin/projects"),
    count<Skill>("/skills"),
    count<EducationItem>("/education"),
    count<ExperienceItem>("/experiences"),
    serverApi<{ count: number }>("/messages/unread-count").catch(() => ({ count: 0 })),
  ]);
  const published = projects.filter((p) => p.status === "published").length;

  const cards = [
    { href: "/admin/projects", label: "Projets", value: projects.length, detail: `${published} publié(s)`, icon: FolderKanban },
    { href: "/admin/skills", label: "Compétences", value: skills.length, icon: Wrench },
    { href: "/admin/education", label: "Formations", value: education.length, icon: GraduationCap },
    { href: "/admin/experiences", label: "Expériences", value: experiences.length, icon: Briefcase },
    { href: "/admin/messages", label: "Messages non lus", value: unread.count, icon: Mail },
  ];

  return (
    <>
      <SectionTitle title="Tableau de bord" description="Gérez le contenu affiché sur votre portfolio." />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ href, label, value, detail, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition hover:border-cyan-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
                  {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
                </div>
                <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-500">
                  <Icon size={28} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/admin/projects/new" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400">
          + Ajouter un projet
        </Link>
      </div>
    </>
  );
}
