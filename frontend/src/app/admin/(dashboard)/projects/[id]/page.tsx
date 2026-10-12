import { notFound } from "next/navigation";

import ProjectForm from "@/components/admin/ProjectForm";
import SectionTitle from "@/components/ui/SectionTitle";
import { ApiError } from "@/lib/api";
import { serverApi } from "@/lib/server-api";
import type { Project } from "@/types";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let project: Project;
  try {
    project = await serverApi<Project>(`/projects/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  const categories = await serverApi<string[]>("/admin/projects/categories").catch(() => []);

  return (
    <>
      <SectionTitle title="Modifier le projet" description={project.title} />
      <ProjectForm project={project} categories={categories} />
    </>
  );
}
