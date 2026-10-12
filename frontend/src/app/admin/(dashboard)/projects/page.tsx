/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { ErrorBanner, inputClass } from "@/components/admin/fields";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { handleAdminError } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { projectsService } from "@/services/projects";
import type { Project, ProjectStatus } from "@/types";

const statusLabel: Record<ProjectStatus, string> = {
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
};
const statusStyle: Record<ProjectStatus, string> = {
  published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  draft: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  archived: "bg-slate-500/10 text-slate-500",
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtered = Boolean(search.trim() || category || status);

  const load = useCallback(async () => {
    try {
      setProjects(await projectsService.listAdmin({ search, category, status }));
      setError(null);
    } catch (e) {
      setError(handleAdminError(e));
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  // Recherche avec léger délai pour éviter une requête à chaque frappe
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    projectsService.categories().then(setCategories).catch(() => undefined);
  }, [projects.length]);

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next); // affichage immédiat
    try {
      await projectsService.reorder(next.map((p) => p.id));
    } catch (e) {
      setError(handleAdminError(e));
      load();
    }
  }

  async function remove(project: Project) {
    if (!window.confirm(`Supprimer définitivement « ${project.title} » ?`)) return;
    try {
      await projectsService.remove(project.id);
      setProjects((list) => list.filter((p) => p.id !== project.id));
    } catch (e) {
      setError(handleAdminError(e));
    }
  }

  return (
    <>
      <SectionTitle
        title="Projets"
        description="Ajoutez, modifiez, supprimez et ordonnez les projets affichés sur le site."
        action={
          <Link href="/admin/projects/new">
            <Button>
              <Plus size={18} /> Ajouter un projet
            </Button>
          </Link>
        }
      />

      <Card className="mb-6 grid gap-4 md:grid-cols-[1fr_200px_200px]">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Rechercher (titre, description, technologie…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(inputClass, "pl-11")}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} aria-label="Catégorie">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus | "")}
          className={inputClass}
          aria-label="Statut"
        >
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
        </select>
      </Card>

      <ErrorBanner message={error} />
      {filtered && (
        <p className="mb-4 text-sm text-slate-500">
          Le changement d&apos;ordre est disponible quand aucun filtre n&apos;est actif.
        </p>
      )}

      <div className="space-y-4">
        {loading && <p className="text-slate-500">Chargement…</p>}
        {!loading && projects.length === 0 && (
          <Card className="text-center text-slate-500">
            {filtered ? "Aucun projet ne correspond à ces filtres." : "Aucun projet pour le moment."}
          </Card>
        )}

        {projects.map((project, index) => (
          <Card key={project.id} className="flex flex-wrap items-center gap-4 p-4">
            {project.image ? (
              <img src={project.image} alt="" className="h-16 w-24 rounded-xl object-cover" />
            ) : (
              <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20" />
            )}

            <div className="min-w-0 flex-1 basis-60">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-slate-900 dark:text-white">{project.title}</h2>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[project.status])}>
                  {statusLabel[project.status]}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">
                {[project.category, project.technologies.join(", ")].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Monter"
                disabled={filtered || index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Descendre"
                disabled={filtered || index === projects.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={16} />
              </Button>
              <Link href={`/admin/projects/${project.id}`}>
                <Button variant="outline" size="sm">
                  <Pencil size={14} /> Modifier
                </Button>
              </Link>
              <Button variant="danger" size="sm" aria-label="Supprimer" onClick={() => remove(project)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
