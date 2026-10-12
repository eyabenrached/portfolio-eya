"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { ApiError } from "@/lib/api";
import { messagesService } from "@/services/resources";
import type { SiteConfig } from "@/types";

const schema = z.object({
  name: z.string().trim().min(1, "Votre nom est requis").max(120),
  email: z.string().trim().email("Adresse email invalide"),
  subject: z.string().trim().min(1, "Le sujet est requis").max(200),
  message: z.string().trim().min(1, "Le message est requis").max(5000),
  website: z.string().max(200).optional(), // champ piège anti-spam (invisible)
});

type FormValues = z.infer<typeof schema>;

const inputClass = `
  w-full
  bg-white
  dark:bg-slate-950
  border
  border-slate-200
  dark:border-slate-800
  rounded-xl
  px-5
  py-4
  text-slate-900
  dark:text-white
  placeholder:text-slate-400
  dark:placeholder:text-slate-600
  outline-none
  focus:border-cyan-400
  transition
`;

const cardClass = `
  bg-slate-50
  dark:bg-slate-900
  border
  border-slate-200
  dark:border-slate-800
  rounded-3xl
  p-8
  shadow-sm
  dark:shadow-none
  transition-colors
  duration-300
`;

const iconBoxClass = `
  p-3
  rounded-xl
  bg-cyan-500/10
  text-cyan-500
  dark:text-cyan-400
`;

const socialClass = `
  p-3
  rounded-xl
  bg-slate-200
  dark:bg-slate-800
  text-slate-700
  dark:text-white
  hover:bg-cyan-500
  hover:text-white
  transition
`;

export default function Contact({ site }: { site: SiteConfig }) {
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFeedback(null);
    try {
      await messagesService.send(values);
      reset();
      setFeedback({ type: "success", text: "Merci ! Votre message a bien été envoyé." });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof ApiError && error.status === 429
            ? "Trop de messages envoyés. Merci de réessayer dans quelques minutes."
            : "L'envoi a échoué. Veuillez réessayer plus tard.",
      });
    }
  }

  return (
    <section
      id="contact"
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
            CONTACT
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
            Travaillons ensemble
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
            Vous avez un projet, une opportunité ou simplement une question ?
            N&apos;hésitez pas à me contacter.
          </p>
        </motion.div>

        {/* CONTENU */}
        <div className="grid md:grid-cols-2 gap-10 mt-16">

          {/* INFORMATIONS */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cardClass}
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Mes coordonnées
            </h3>

            <div className="space-y-6 mt-8">

              {/* EMAIL */}
              <div className="flex items-center gap-4">
                <div className={iconBoxClass}>
                  <Mail size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-slate-900 dark:text-white font-medium break-all">
                    {site.email}
                  </p>
                </div>
              </div>

              {/* LOCALISATION */}
              <div className="flex items-center gap-4">
                <div className={iconBoxClass}>
                  <MapPin size={22} />
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Localisation</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {site.location}
                  </p>
                </div>
              </div>

            </div>

            {/* RÉSEAUX SOCIAUX */}
            <div className="flex gap-4 mt-10">
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={socialClass}
              >
                <FaGithub size={22} />
              </a>

              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={socialClass}
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </motion.div>

          {/* FORMULAIRE */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cardClass}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-5">

              {/* NOM */}
              <div>
                <input
                  type="text"
                  placeholder="Votre nom"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={inputClass}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
              </div>

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  placeholder="Votre email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={inputClass}
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
              </div>

              {/* SUJET */}
              <div>
                <input
                  type="text"
                  placeholder="Sujet"
                  aria-invalid={!!errors.subject}
                  className={inputClass}
                  {...register("subject")}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-2">{errors.subject.message}</p>}
              </div>

              {/* MESSAGE */}
              <div>
                <textarea
                  rows={5}
                  placeholder="Votre message"
                  aria-invalid={!!errors.message}
                  className={`${inputClass} resize-none`}
                  {...register("message")}
                />
                {errors.message && <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>}
              </div>

              {/* Champ piège anti-spam : invisible pour les humains */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                {...register("website")}
              />

              {/* BOUTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-cyan-500
                  hover:bg-cyan-400
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  rounded-xl
                  px-6
                  py-4
                  transition
                "
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                <Send size={18} />
              </button>

              {feedback && (
                <p
                  role="status"
                  className={
                    feedback.type === "success"
                      ? "text-emerald-600 dark:text-emerald-400 text-sm"
                      : "text-red-500 text-sm"
                  }
                >
                  {feedback.text}
                </p>
              )}

            </div>
          </motion.form>

        </div>
      </div>
    </section>
  );
}
