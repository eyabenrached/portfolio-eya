"use client";

import { motion } from "framer-motion";
import { Code2, Brain, Database } from "lucide-react";

export default function About() {
  const cards = [
    {
      icon: Code2,
      title: "Développement Web",
      desc: "Applications modernes avec Next.js, React, Angular et FastAPI.",
    },
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      desc: "Création d'applications intégrant des modèles d'IA et des LLM.",
    },
    {
      icon: Database,
      title: "Bases de données",
      desc: "Conception de bases PostgreSQL et MySQL performantes.",
    },
  ];

  return (
    <section
      id="about"
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
          À propos de moi
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="
            text-center
            text-slate-600
            dark:text-slate-400
            mt-6
            max-w-3xl
            mx-auto
            leading-8
            text-lg
          "
        >
          Passionnée par le développement Full Stack et l&apos;Intelligence
          Artificielle, je conçois des applications performantes,
          intuitives et sécurisées.
        </motion.p>

        {/* CARTES */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">

          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="
                  group
                  bg-white
                  dark:bg-slate-950
                  border
                  border-slate-200
                  dark:border-slate-800
                  rounded-3xl
                  p-8
                  shadow-sm
                  dark:shadow-none
                  hover:border-cyan-400
                  transition-all
                  duration-300
                "
              >

                {/* ICÔNE */}
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    bg-cyan-500/10
                    dark:bg-cyan-500/10
                    text-cyan-500
                    dark:text-cyan-400
                    mb-6
                    group-hover:scale-110
                    transition-transform
                    duration-300
                  "
                >
                  <Icon size={30} />
                </div>

                {/* TITRE */}
                <h3
                  className="
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {card.title}
                </h3>

                {/* DESCRIPTION */}
                <p
                  className="
                    text-slate-600
                    dark:text-slate-400
                    mt-4
                    leading-7
                  "
                >
                  {card.desc}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}