"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { experiencesService } from "@/services/resources";
import type { ExperienceItem } from "@/types";

export default function ExperiencesAdminPage() {
  return (
    <ResourceManager<ExperienceItem>
      title="Expérience"
      description="Stages, projets de fin d'études et expériences professionnelles."
      singular="expérience"
      service={experiencesService}
      defaults={{ date: "", title: "", company: "", description: "", technologies: [] }}
      fields={[
        { name: "title", label: "Poste / intitulé", type: "text", required: true },
        { name: "company", label: "Entreprise", type: "text", required: true },
        { name: "date", label: "Période", type: "text", required: true, placeholder: "2025 – 2026" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "technologies", label: "Technologies", type: "tags" },
      ]}
      renderItem={(item) => (
        <>
          <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
          <p className="text-sm text-slate-500">
            {item.company} · {item.date}
          </p>
        </>
      )}
    />
  );
}
