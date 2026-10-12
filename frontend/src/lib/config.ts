import type { SiteConfig } from "@/types";

/** Coordonnées affichées sur le site — lues au runtime depuis les variables d'environnement serveur. */
export function getSiteConfig(): SiteConfig {
  return {
    email: process.env.SITE_EMAIL || "votre.email@example.com",
    location: process.env.SITE_LOCATION || "Tunisie",
    githubUrl: process.env.SITE_GITHUB_URL || "#",
    linkedinUrl: process.env.SITE_LINKEDIN_URL || "#",
  };
}
