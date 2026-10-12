import { api } from "@/lib/api";
import type { Project, ProjectInput, ProjectStatus } from "@/types";

export interface ProjectFilters {
  search?: string;
  category?: string;
  status?: ProjectStatus | "";
}

function query(filters: ProjectFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const projectsService = {
  // Site public : projets publiés uniquement
  listPublic: () => api<Project[]>("/projects"),
  // Dashboard : tous les statuts + filtres
  listAdmin: (filters?: ProjectFilters) => api<Project[]>(`/admin/projects${query(filters)}`),
  categories: () => api<string[]>("/admin/projects/categories"),
  get: (id: number) => api<Project>(`/projects/${id}`),
  create: (data: ProjectInput) => api<Project>("/projects", { method: "POST", json: data }),
  update: (id: number, data: Partial<ProjectInput>) =>
    api<Project>(`/projects/${id}`, { method: "PUT", json: data }),
  remove: (id: number) => api(`/projects/${id}`, { method: "DELETE" }),
  reorder: (ids: number[]) => api("/projects/reorder", { method: "PUT", json: { ids } }),
};
