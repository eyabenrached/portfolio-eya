"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { handleAdminError } from "@/lib/admin";
import type { createResourceService } from "@/services/resources";

import { ErrorBanner, Field, TagInput, inputClass } from "./fields";

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "tags";
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  hint?: string;
  /** Pleine largeur dans le formulaire */
  wide?: boolean;
}

type Values = Record<string, string | number | string[]>;

interface Props<T extends { id: number }> {
  title: string;
  description: string;
  singular: string;
  service: ReturnType<typeof createResourceService<T>>;
  fields: FieldDef[];
  defaults: Values;
  renderItem: (item: T) => ReactNode;
}

/** Page d'administration générique : liste ordonnée + formulaire d'ajout/modification. */
export default function ResourceManager<T extends { id: number }>({
  title,
  description,
  singular,
  service,
  fields,
  defaults,
  renderItem,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<Values>(defaults);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await service.list());
      setError(null);
    } catch (e) {
      setError(handleAdminError(e));
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setValues(defaults);
    setFormOpen(true);
  }

  function openEdit(item: T) {
    const next: Values = {};
    for (const field of fields) {
      const raw = (item as Record<string, unknown>)[field.name];
      next[field.name] = (raw ?? defaults[field.name]) as Values[string];
    }
    setEditingId(item.id);
    setValues(next);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = values[field.name];
      payload[field.name] =
        field.type === "number" ? Number(value) : typeof value === "string" ? value.trim() : value;
    }

    try {
      if (editingId === null) await service.create(payload);
      else await service.update(editingId, payload);
      closeForm();
      await load();
    } catch (e) {
      setError(handleAdminError(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: T) {
    if (!window.confirm(`Supprimer ce(tte) ${singular} ?`)) return;
    try {
      await service.remove(item.id);
      setItems((list) => list.filter((i) => i.id !== item.id));
    } catch (e) {
      setError(handleAdminError(e));
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    try {
      await service.reorder(next.map((i) => i.id));
    } catch (e) {
      setError(handleAdminError(e));
      load();
    }
  }

  return (
    <>
      <SectionTitle
        title={title}
        description={description}
        action={
          !formOpen && (
            <Button onClick={openCreate}>
              <Plus size={18} /> Ajouter
            </Button>
          )
        }
      />

      {formOpen && (
        <Card className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
            {editingId === null ? `Nouveau / nouvelle ${singular}` : `Modifier ${singular}`}
          </h2>
          <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <Field
                key={field.name}
                label={field.label + (field.required ? " *" : "")}
                hint={field.hint}
                className={field.wide || field.type === "textarea" || field.type === "tags" ? "md:col-span-2" : ""}
              >
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={values[field.name] as string}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                    className={`${inputClass} resize-y`}
                  />
                ) : field.type === "tags" ? (
                  <TagInput
                    value={values[field.name] as string[]}
                    onChange={(tags) => setValues({ ...values, [field.name]: tags })}
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={values[field.name] as string | number}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                    className={inputClass}
                  />
                )}
              </Field>
            ))}

            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button variant="ghost" onClick={closeForm}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ErrorBanner message={error} />

      <div className="mt-4 space-y-4">
        {loading && <p className="text-slate-500">Chargement…</p>}
        {!loading && items.length === 0 && <Card className="text-center text-slate-500">Aucun élément.</Card>}

        {items.map((item, index) => (
          <Card key={item.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1 basis-60">{renderItem(item)}</div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" aria-label="Monter" disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Descendre"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                <Pencil size={14} /> Modifier
              </Button>
              <Button variant="danger" size="sm" aria-label="Supprimer" onClick={() => remove(item)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
