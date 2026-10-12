"use client";

import { motion } from "framer-motion";

import type { Skill } from "@/types";

export default function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section
      id="skills"
      className="
        py-24
        px-6
        bg-white
        dark:bg-slate-950
        transition-colors
        duration-300
      "
    >
      <div className="max-w-6xl mx-auto">

        {/* TITRE */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            text-4xl
            md:text-5xl
            font-bold
            text-center
            text-slate-900
            dark:text-white
          "
        >
          Mes compétences
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="
            text-center
            text-slate-600
            dark:text-slate-400
            mt-4
            text-lg
          "
        >
          Les technologies que j&apos;utilise au quotidien.
        </motion.p>

        {/* COMPÉTENCES */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">

          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
              }}
              viewport={{ once: true }}
              className="
                bg-slate-50
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-800
                p-6
                rounded-2xl
                hover:border-cyan-400
                transition-all
                duration-300
              "
            >

              {/* NOM + POURCENTAGE */}
              <div className="flex justify-between mb-3">

                <span
                  className="
                    text-slate-900
                    dark:text-white
                    font-semibold
                  "
                >
                  {skill.name}
                </span>

                <span className="text-cyan-500 dark:text-cyan-400 font-semibold">
                  {skill.level}%
                </span>

              </div>

              {/* BARRE */}
              <div
                className="
                  w-full
                  h-3
                  bg-slate-200
                  dark:bg-slate-700
                  rounded-full
                  overflow-hidden
                "
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="
                    h-full
                    bg-cyan-400
                    rounded-full
                  "
                />
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}