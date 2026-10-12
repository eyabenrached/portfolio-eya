"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        min-h-screen
        flex
        items-center
        overflow-hidden
        px-6
        pt-24
        bg-white
        dark:bg-slate-950
        transition-colors
        duration-300
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">

        <div
          className="
            absolute
            top-20
            left-10
            w-72
            h-72
            bg-cyan-400/10
            dark:bg-cyan-500/10
            rounded-full
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-10
            right-10
            w-96
            h-96
            bg-blue-400/10
            dark:bg-blue-600/10
            rounded-full
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06),transparent_45%)]
            dark:bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_45%)]
          "
        />

      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <span className="text-cyan-500 dark:text-cyan-400 font-semibold text-lg">
              👋 Bonjour, je suis
            </span>

            <h1
              className="
                text-5xl
                md:text-6xl
                lg:text-7xl
                font-extrabold
                mt-4
                leading-tight
                text-slate-900
                dark:text-white
              "
            >
              Eya
              <br />

              <span className="text-cyan-500 dark:text-cyan-400">
                Ben Rached
              </span>
            </h1>

            {/* ANIMATION */}
            <div
              className="
                text-xl
                md:text-2xl
                mt-6
                font-semibold
                min-h-[70px]
                text-slate-700
                dark:text-slate-300
              "
            >
              <TypeAnimation
                sequence={[
                  "Développeuse Full Stack",
                  2000,
                  "Passionnée par l'Intelligence Artificielle",
                  2000,
                  "Python • FastAPI • Next.js",
                  2000,
                  "Créatrice de solutions intelligentes",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>

            {/* DESCRIPTION */}
            <p
              className="
                text-slate-600
                dark:text-slate-400
                mt-6
                text-lg
                max-w-xl
                leading-8
              "
            >
              Je développe des applications web modernes,
              performantes et intelligentes avec Next.js,
              FastAPI, Spring Boot et l&apos;Intelligence Artificielle.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10 flex-wrap">

              <a
                href="#projects"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  bg-cyan-500
                  hover:bg-cyan-400
                  transition-all
                  duration-300
                  px-7
                  py-4
                  rounded-xl
                  text-white
                  font-semibold
                  shadow-lg
                  shadow-cyan-500/20
                "
              >
                Voir mes projets

                <ArrowRight
                  size={20}
                  className="
                    group-hover:translate-x-1
                    transition-transform
                  "
                />
              </a>

              <a
                href="/cv.pdf"
                download
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-cyan-500
                  text-cyan-500
                  dark:border-cyan-400
                  dark:text-cyan-400
                  hover:bg-cyan-500
                  hover:text-white
                  dark:hover:bg-cyan-400
                  dark:hover:text-slate-950
                  transition-all
                  duration-300
                  px-7
                  py-4
                  rounded-xl
                  font-semibold
                "
              >
                Télécharger mon CV

                <Download size={20} />
              </a>

            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-8 mt-12">

              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  Full Stack
                </p>

                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                  Développement
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  IA
                </p>

                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                  Intelligence Artificielle
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  Web
                </p>

                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                  Applications modernes
                </p>
              </div>

            </div>

          </motion.div>

          {/* PHOTO */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >

            <div className="relative">

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.25, 0.4, 0.25],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  -inset-8
                  rounded-full
                  bg-cyan-400
                  dark:bg-cyan-500
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -inset-4
                  rounded-full
                  border
                  border-cyan-400/40
                  dark:border-cyan-400/30
                "
              />

              <img
                src="/profile.png"
                alt="Eya Ben Rached"
                className="
                  relative
                  w-64
                  h-64
                  md:w-80
                  md:h-80
                  lg:w-96
                  lg:h-96
                  rounded-full
                  object-cover
                  border-4
                  border-cyan-400
                  shadow-2xl
                  shadow-cyan-500/20
                "
              />

            </div>

          </motion.div>

        </div>

      </div>

      {/* SCROLL */}
      <motion.a
        href="#about"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          text-slate-500
          hover:text-cyan-500
          dark:hover:text-cyan-400
          transition
          text-sm
        "
      >
        Scroll ↓
      </motion.a>

    </section>
  );
}