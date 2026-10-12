import { api } from "@/lib/api";
import type {
  ContactMessage,
  EducationItem,
  ExperienceItem,
  Skill,
} from "@/types";

/** Client REST générique pour les ressources ordonnées (compétences, formation, expérience). */
export function createResourceService<T extends { id: number }>(endpoint: string) {
  return {
    list: () => api<T[]>(endpoint),
    create: (data: Record<string, unknown>) => api<T>(endpoint, { method: "POST", json: data }),
    update: (id: number, data: Record<string, unknown>) =>
      api<T>(`${endpoint}/${id}`, { method: "PUT", json: data }),
    remove: (id: number) => api(`${endpoint}/${id}`, { method: "DELETE" }),
    reorder: (ids: number[]) => api(`${endpoint}/reorder`, { method: "PUT", json: { ids } }),
  };
}

export const skillsService = createResourceService<Skill>("/skills");
export const educationService = createResourceService<EducationItem>("/education");
export const experiencesService = createResourceService<ExperienceItem>("/experiences");

export const messagesService = {
  send: (data: { name: string; email: string; subject: string; message: string; website?: string }) =>
    api("/messages", { method: "POST", json: data }),
  list: () => api<ContactMessage[]>("/messages"),
  unreadCount: () => api<{ count: number }>("/messages/unread-count"),
  setRead: (id: number, is_read: boolean) =>
    api<ContactMessage>(`/messages/${id}`, { method: "PATCH", json: { is_read } }),
  remove: (id: number) => api(`/messages/${id}`, { method: "DELETE" }),
};
