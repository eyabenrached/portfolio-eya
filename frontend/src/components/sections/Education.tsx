"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar } from "lucide-react";

import type { EducationItem } from "@/types";

export default function Education({ education }: { education: EducationItem[] }) {
  if (education.length === 0) return null;

  return (
    <section
      id="education"
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
            Formation
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
            Mon parcours académique et les compétences développées
            au cours de ma formation.
          </p>
        </motion.div>

        {/* FORMATION */}
        <div className="relative mt-16 max-w-4xl mx-auto">

          {/* LIGNE */}
          <div
            className="
              absolute
              left-6
              top-0
              bottom-0
              w-px
              bg-slate-300
              dark:bg-slate-700
              md:left-1/2
            "
          />

          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              className="relative"
            >

              {/* POINT */}
              <div
                className="
                  absolute
                  left-6
                  -translate-x-1/2
                  w-5
                  h-5
                  rounded-full
                  bg-cyan-400
                  border-4
                  border-white
                  dark:border-slate-950
                  z-10
                  md:left-1/2
                "
              />

              {/* CARTE */}
              <div className="ml-12 md:ml-0 md:w-[46%] md:mr-auto">

                <div
                  className="
                    bg-slate-50
                    dark:bg-slate-900
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
                    {item.date}
                  </div>

                  {/* TITRE */}
                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-slate-900
                      dark:text-white
                      mt-4
                    "
                  >
                    {item.title}
                  </h3>

                  {/* ÉCOLE */}
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
                    <GraduationCap size={19} />
                    {item.school}
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
                    {item.description}
                  </p>

                  {/* COMPÉTENCES */}
                  <div className="flex flex-wrap gap-2 mt-6">

                    {item.skills.map((skill) => (
                      <span
                        key={skill}
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
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}