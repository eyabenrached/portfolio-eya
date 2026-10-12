/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ImagePlus, X } from "lucide-react";

import { handleAdminError } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/services/uploads";

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

/** Saisie de tags : Entrée ou virgule pour ajouter, croix pour retirer. */
export function TagInput({
  value,
  onChange,
  placeholder = "Ajouter puis Entrée",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim().replace(/,$/, "").trim();
    if (tag && !value.some((t) => t.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className={cn(inputClass, "flex flex-wrap items-center gap-2 py-2")}>
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:text-cyan-400"
        >
          {tag}
          <button
            type="button"
            aria-label={`Retirer ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="hover:text-red-500"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[8rem] flex-1 bg-transparent py-1 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

/** Envoi d'une ou plusieurs images vers l'API (/api/uploads). */
export function ImageUploader({
  images,
  onChange,
  multiple = false,
  label,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} dépasse 5 Mo`);
        urls.push(await uploadImage(file));
      }
      onChange(multiple ? [...images, ...urls] : urls.slice(0, 1));
    } catch (e) {
      setError(e instanceof Error && !("status" in e) ? e.message : handleAdminError(e));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex flex-wrap gap-3">
        {images.map((src) => (
          <div key={src} className="group relative">
            <img src={src} alt="" className="h-24 w-32 rounded-xl border border-slate-200 object-cover dark:border-slate-800" />
            <button
              type="button"
              aria-label="Retirer l'image"
              onClick={() => onChange(images.filter((i) => i !== src))}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow transition hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {(multiple || images.length === 0) && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 transition hover:border-cyan-400 hover:text-cyan-500 disabled:opacity-50 dark:border-slate-700"
          >
            <ImagePlus size={22} />
            {busy ? "Envoi..." : "Ajouter"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
