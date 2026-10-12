import type { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** En-tête de page du dashboard : titre, description et action (ex. bouton « Ajouter »). */
export default function SectionTitle({ title, description, action }: SectionTitleProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
