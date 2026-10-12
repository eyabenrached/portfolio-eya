"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-xl border border-slate-300 dark:border-slate-700"
        aria-label="Changer le thème"
      >
        <Sun size={20} />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Changer le thème"
      className="
        p-2
        rounded-xl
        border
        border-slate-300
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        text-slate-800
        dark:text-white
        hover:text-cyan-400
        transition
      "
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}