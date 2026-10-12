"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

import type { ExperienceItem } from "@/types";

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  if (experiences.length === 0) return null;

  return (
    <section
      id="experience"
      className="
        py-24
        px-6
        bg-slate-50
        dark:bg-slate-900
        transition-colors
        duration-300
      "
    >
      <div className="max-w-6xl mx-auto">

        {/* TITRE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-cyan-500 dark:text-cyan-400 font-semibold mb-3">
            MON PARCOURS
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
            Expérience
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
            Mon parcours dans le développement web et l&apos;intelligence
            artificielle.
          </p>
        </motion.div>

        {/* TIMELINE */}
        <div className="relative mt-20">

          {/* Ligne centrale */}
          <div
            className="
              hidden
              md:block
              absolute
              left-1/2
              top-0
              bottom-0
              w-px
              bg-slate-300
              dark:bg-slate-700
            "
          />

          <div className="space-y-16">

            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                }}
                className="relative"
              >

                {/* Point central */}
                <div
                  className="
                    hidden
                    md:flex
                    absolute
                    left-1/2
                    -translate-x-1/2
                    w-5
                    h-5
                    rounded-full
                    bg-cyan-400
                    border-4
                    border-slate-50
                    dark:border-slate-900
                    z-10
                  "
                />

                <div
                  className={`md:w-[46%] ${
                    index % 2 === 0
                      ? "md:mr-auto"
                      : "md:ml-auto"
                  }`}
                >

                  {/* CARTE */}
                  <div
                    className="
                      bg-white
                      dark:bg-slate-950
                      border
                      border-slate-200
                      dark:border-slate-800
                      rounded-3xl
                      p-7
                      shadow-sm
                      dark:shadow-none
                      hover:border-cyan-400/50
                      transition-all
                      duration-300
                    "
                  >

                    {/* DATE */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-cyan-500
                        dark:text-cyan-400
                        text-sm
                        font-semibold
                      "
                    >
                      <Calendar size={17} />
                      {experience.date}
                    </div>

                    {/* TITRE */}
                    <h3
                      className="
                        text-xl
                        md:text-2xl
                        font-bold
                        text-slate-900
                        dark:text-white
                        mt-4
                      "
                    >
                      {experience.title}
                    </h3>

                    {/* ENTREPRISE */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-slate-600
                        dark:text-slate-300
                        mt-3
                      "
                    >
                      <Briefcase size={17} />
                      {experience.company}
                    </div>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-slate-600
                        dark:text-slate-400
                        leading-7
                        mt-5
                      "
                    >
                      {experience.description}
                    </p>

                    {/* TECHNOLOGIES */}
                    <div className="flex flex-wrap gap-2 mt-6">

                      {experience.technologies.map(
                        (technology) => (
                          <span
                            key={technology}
                            className="
                              text-sm
                              text-cyan-600
                              dark:text-cyan-400
                              bg-cyan-500/10
                              border
                              border-cyan-500/20
                              px-3
                              py-1.5
                              rounded-full
                            "
                          >
                            {technology}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}