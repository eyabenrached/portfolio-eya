"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { educationService } from "@/services/resources";
import type { EducationItem } from "@/types";

export default function EducationAdminPage() {
  return (
    <ResourceManager<EducationItem>
      title="Formation"
      description="Votre parcours scolaire et universitaire."
      singular="formation"
      service={educationService}
      defaults={{ date: "", title: "", school: "", description: "", skills: [] }}
      fields={[
        { name: "title", label: "Diplôme / formation", type: "text", required: true },
        { name: "school", label: "Établissement", type: "text", required: true },
        { name: "date", label: "Période", type: "text", required: true, placeholder: "2023 – 2026" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "skills", label: "Domaines / compétences acquises", type: "tags" },
      ]}
      renderItem={(item) => (
        <>
          <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
          <p className="text-sm text-slate-500">
            {item.school} · {item.date}
          </p>
        </>
      )}
    />
  );
}
