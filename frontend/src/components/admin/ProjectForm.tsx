"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { handleAdminError } from "@/lib/admin";
import { projectsService } from "@/services/projects";
import type { Project, ProjectInput, ProjectStatus } from "@/types";

import { ErrorBanner, Field, ImageUploader, TagInput, inputClass } from "./fields";

interface Props {
  project?: Project;
  categories: string[];
}

export default function ProjectForm({ project, categories }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [image, setImage] = useState<string[]>(project?.image ? [project.image] : []);
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies ?? []);
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demo_url ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [projectDate, setProjectDate] = useState(project?.project_date ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "published");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: ProjectInput = {
      title: title.trim(),
      description: description.trim(),
      image: image[0] ?? null,
      gallery,
      technologies,
      github_url: githubUrl.trim() || null,
      demo_url: demoUrl.trim() || null,
      category: category.trim(),
      project_date: projectDate || null,
      status,
    };

    try {
      if (project) await projectsService.update(project.id, payload);
      else await projectsService.create(payload);
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(handleAdminError(e));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-5">
        <Field label="Titre *">
          <input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Description">
          <textarea
            rows={5}
            maxLength={5000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Technologies" hint="Entrée ou virgule pour valider chaque technologie">
          <TagInput value={technologies} onChange={setTechnologies} placeholder="Next.js, FastAPI…" />
        </Field>
      </Card>

      <Card className="space-y-5">
        <ImageUploader label="Image principale" images={image} onChange={setImage} />
        <ImageUploader label="Images supplémentaires" images={gallery} onChange={setGallery} multiple />
      </Card>

      <Card className="grid gap-5 md:grid-cols-2">
        <Field label="Lien GitHub">
          <input
            type="url"
            placeholder="https://github.com/..."
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Lien de démo / projet">
          <input
            type="url"
            placeholder="https://..."
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Catégorie">
          <input
            list="project-categories"
            maxLength={100}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          />
          <datalist id="project-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label="Date du projet">
          <input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Statut" hint="Seuls les projets « Publié » apparaissent sur le site">
          <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className={inputClass}>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </Field>
      </Card>

      <ErrorBanner message={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : project ? "Enregistrer les modifications" : "Créer le projet"}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/admin/projects")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
