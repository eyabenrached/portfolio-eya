"use client";

import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import type { SiteConfig } from "@/types";

export default function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer
      className="
        bg-slate-100
        dark:bg-slate-900
        transition-colors
        duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* LOGO */}
          <div className="text-center md:text-left">
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Eya<span className="text-cyan-400">.</span>
            </h3>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Développeuse Full Stack & IA
            </p>
          </div>

          {/* RÉSEAUX */}
          <div className="flex items-center gap-4">

            {/* GitHub */}
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                p-3
                rounded-xl
                bg-white
                dark:bg-slate-950
                border
                border-slate-200
                dark:border-slate-800
                text-slate-600
                dark:text-slate-400
                hover:text-cyan-500
                dark:hover:text-cyan-400
                hover:border-cyan-400
                transition
              "
            >
              <FaGithub size={20} />
            </a>

            {/* LinkedIn */}
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                p-3
                rounded-xl
                bg-white
                dark:bg-slate-950
                border
                border-slate-200
                dark:border-slate-800
                text-slate-600
                dark:text-slate-400
                hover:text-cyan-500
                dark:hover:text-cyan-400
                hover:border-cyan-400
                transition
              "
            >
              <FaLinkedin size={20} />
            </a>

            {/* RETOUR EN HAUT */}
            <a
              href="#home"
              aria-label="Retour en haut"
              className="
                p-3
                rounded-xl
                bg-cyan-500
                text-white
                hover:bg-cyan-400
                transition
              "
            >
              <ArrowUp size={20} />
            </a>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div
          className="
            border-t
            border-slate-200
            dark:border-slate-800
            mt-8
            pt-6
            text-center
          "
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} Eya Ben Rached.
            Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
}