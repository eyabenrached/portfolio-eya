export type ProjectStatus = "draft" | "published" | "archived";

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  gallery: string[];
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
  category: string;
  project_date: string | null;
  status: ProjectStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  image: string | null;
  gallery: string[];
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
  category: string;
  project_date: string | null;
  status: ProjectStatus;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  display_order: number;
}

export interface EducationItem {
  id: number;
  date: string;
  title: string;
  school: string;
  description: string;
  skills: string[];
  display_order: number;
}

export interface ExperienceItem {
  id: number;
  date: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  display_order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
}

export interface SiteConfig {
  email: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}
