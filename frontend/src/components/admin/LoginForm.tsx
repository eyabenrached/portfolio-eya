"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ApiError } from "@/lib/api";
import { authService } from "@/services/auth";

import { ErrorBanner, Field, inputClass } from "./fields";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Connexion impossible");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
          <Lock size={26} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Espace administrateur</h1>
        <p className="mt-2 text-sm text-slate-500">Connectez-vous pour gérer le contenu du portfolio.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Mot de passe">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>

        <ErrorBanner message={error} />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </Card>
  );
}
