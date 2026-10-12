/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import type { Project } from "@/types";
import ProjectGallery from "./ProjectGallery";

export default function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="
        py-24
        px-6
        bg-slate-50
        dark:bg-slate-900
        transition-colors
        duration-300
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* TITRE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-cyan-500 dark:text-cyan-400 font-semibold mb-3">
            MES RÉALISATIONS
          </p>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Mes Projets
          </h2>

          <p
            className="
              text-slate-600
              dark:text-slate-400
              mt-5
              max-w-2xl
              mx-auto
              leading-7
            "
          >
            Découvrez quelques-uns de mes projets réalisés dans le domaine
            du développement web, de l&apos;intelligence artificielle et des
            applications métier.
          </p>
        </motion.div>

        {projects.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 mt-16">
            Les projets arrivent bientôt.
          </p>
        )}

        {/* CARTES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
              }}
              className="
                group
                bg-white
                dark:bg-slate-950
                border
                border-slate-200
                dark:border-slate-800
                rounded-3xl
                overflow-hidden
                hover:border-cyan-400/50
                shadow-sm
                dark:shadow-none
                transition-all
                duration-300
              "
            >

              {/* IMAGE */}
              <div
                className={`relative overflow-hidden ${project.gallery.length > 0 ? "cursor-pointer" : ""}`}
                onClick={() => project.gallery.length > 0 && setSelected(project)}
              >

                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="
                      w-full
                      h-56
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="w-full h-56 bg-gradient-to-br from-cyan-500/20 to-blue-600/20" />
                )}

                {project.gallery.length > 0 && (
                  <span className="absolute top-3 right-3 z-10 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">
                    +{project.gallery.length} photo{project.gallery.length > 1 ? "s" : ""}
                  </span>
                )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-slate-950/70
                    dark:from-slate-950/80
                    via-transparent
                    to-transparent
                    opacity-70
                  "
                />

              </div>

              {/* CONTENU */}
              <div className="p-7">

                <h3
                  className="
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {project.title}
                </h3>

                <p
                  className="
                    text-slate-600
                    dark:text-slate-400
                    mt-4
                    leading-7
                  "
                >
                  {project.description}
                </p>

                {/* TECHNOLOGIES */}
                <div className="flex flex-wrap gap-2 mt-6">

                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="
                        bg-cyan-500/10
                        border
                        border-cyan-500/20
                        text-cyan-600
                        dark:text-cyan-400
                        px-3
                        py-1.5
                        rounded-full
                        text-sm
                      "
                    >
                      {technology}
                    </span>
                  ))}

                </div>

                {/* BOUTONS */}
                <div className="flex gap-3 mt-8">

                  {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      flex-1
                      bg-cyan-500
                      hover:bg-cyan-400
                      text-white
                      font-semibold
                      px-4
                      py-3
                      rounded-xl
                      transition
                    "
                  >
                    <FaGithub size={18} />
                    GitHub
                  </a>
                  )}

                  {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      flex-1
                      border
                      border-cyan-500
                      dark:border-cyan-400
                      text-cyan-600
                      dark:text-cyan-400
                      hover:bg-cyan-500
                      hover:text-white
                      dark:hover:bg-cyan-400
                      dark:hover:text-slate-950
                      font-semibold
                      px-4
                      py-3
                      rounded-xl
                      transition
                    "
                  >
                    <ExternalLink size={18} />
                    Démo
                  </a>
                  )}

                </div>

              </div>

            </motion.article>
          ))}

        </div>

      </div>

      <ProjectGallery project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}