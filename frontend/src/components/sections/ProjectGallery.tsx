/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type { Project } from "@/types";

interface Props {
  project: Project | null;
  onClose: () => void;
}

/** Fenêtre modale : image principale + images supplémentaires d'un projet. */
export default function ProjectGallery({ project, onClose }: Props) {
  const [active, setActive] = useState(0);
  const images = project ? [project.image, ...project.gallery].filter((u): u is string => !!u) : [];

  function close() {
    setActive(0);
    onClose();
  }

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950 md:p-8"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/70 p-2 text-white transition hover:bg-cyan-500"
            >
              <X size={20} />
            </button>

            <h3 className="pr-10 text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>

            {images.length > 0 && (
              <img
                src={images[active]}
                alt={`${project.title} — image ${active + 1}`}
                className="mt-5 max-h-[55vh] w-full rounded-2xl object-contain bg-slate-100 dark:bg-slate-900"
              />
            )}

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Image ${i + 1}`}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      i === active ? "border-cyan-400" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">{project.description}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
