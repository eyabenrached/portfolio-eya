import Navbar from "@/components/layout/Navbar";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

import Footer from "@/components/layout/Footer";

import { getSiteConfig } from "@/lib/config";
import { getPortfolioData } from "@/services/public";

// Le contenu vient de l'API : toujours à jour, sans rebuild du frontend
export const dynamic = "force-dynamic";

export default async function Home() {
  const { projects, skills, education, experiences } = await getPortfolioData();
  const site = getSiteConfig();

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills skills={skills} />
        <Education education={education} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Contact site={site} />
      </main>

      <Footer site={site} />
    </>
  );
}
