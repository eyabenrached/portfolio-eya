"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { skillsService } from "@/services/resources";
import type { Skill } from "@/types";

export default function SkillsAdminPage() {
  return (
    <ResourceManager<Skill>
      title="Compétences"
      description="Les technologies et niveaux affichés dans la section « Mes compétences »."
      singular="compétence"
      service={skillsService}
      defaults={{ name: "", level: 80 }}
      fields={[
        { name: "name", label: "Nom", type: "text", required: true, placeholder: "Python" },
        { name: "level", label: "Niveau (0 à 100)", type: "number", required: true, min: 0, max: 100 },
      ]}
      renderItem={(skill) => (
        <div className="flex items-center gap-4">
          <span className="w-40 font-semibold text-slate-900 dark:text-white">{skill.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${skill.level}%` }} />
          </div>
          <span className="w-12 text-right text-sm font-semibold text-cyan-600 dark:text-cyan-400">{skill.level}%</span>
        </div>
      )}
    />
  );
}
