import { api } from "@/lib/api";
import type { EducationItem, ExperienceItem, Project, Skill } from "@/types";

/** Données publiques pour le rendu serveur — retourne [] si l'API est indisponible. */
async function safe<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch {
    return [];
  }
}

export async function getPortfolioData() {
  const [projects, skills, education, experiences] = await Promise.all([
    safe(api<Project[]>("/projects")),
    safe(api<Skill[]>("/skills")),
    safe(api<EducationItem[]>("/education")),
    safe(api<ExperienceItem[]>("/experiences")),
  ]);
  return { projects, skills, education, experiences };
}
