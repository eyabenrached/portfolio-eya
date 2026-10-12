"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { name: "Accueil", href: "#home" },
  { name: "À propos", href: "#about" },
  { name: "Compétences", href: "#skills" },
  { name: "Projets", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white/90 dark:bg-slate-950/90
        backdrop-blur-md
        border-b border-slate-200 dark:border-slate-800
        transition-colors duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="
            text-2xl font-bold tracking-wide
            text-slate-900 dark:text-white
            transition-colors
          "
        >
          Eya<span className="text-cyan-400">.</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                text-slate-600 dark:text-slate-300
                hover:text-cyan-500 dark:hover:text-cyan-400
                transition-colors
              "
            >
              {link.name}
            </a>
          ))}

          <ThemeToggle />
        </nav>

        {/* MOBILE */}
        <div className="md:hidden flex items-center gap-3">

          <ThemeToggle />

          <button
            type="button"
            className="text-slate-800 dark:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div
          className="
            md:hidden
            bg-white dark:bg-slate-900
            border-t border-slate-200 dark:border-slate-800
          "
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                block px-6 py-4
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                hover:text-cyan-500 dark:hover:text-cyan-400
                transition
              "
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}