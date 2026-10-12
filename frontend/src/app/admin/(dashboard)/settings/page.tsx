"use client";

import { useState, type FormEvent } from "react";

import { ErrorBanner, Field, inputClass } from "@/components/admin/fields";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { handleAdminError } from "@/lib/admin";
import { authService } from "@/services/auth";

export default function SettingsPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    if (next !== confirm) return setError("Les deux nouveaux mots de passe ne correspondent pas");

    setSaving(true);
    try {
      await authService.changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setSuccess(true);
    } catch (e) {
      setError(handleAdminError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SectionTitle title="Paramètres" description="Sécurité du compte administrateur." />

      <Card className="max-w-lg">
        <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Changer le mot de passe</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <Field label="Mot de passe actuel">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Nouveau mot de passe" hint="8 caractères minimum">
            <input
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Confirmer le nouveau mot de passe">
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </Field>

          <ErrorBanner message={error} />
          {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">Mot de passe modifié.</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Mettre à jour"}
          </Button>
        </form>
      </Card>
    </>
  );
}
