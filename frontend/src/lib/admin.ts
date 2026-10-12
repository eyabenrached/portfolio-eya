import { ApiError } from "@/lib/api";

/**
 * Message d'erreur lisible. Si la session a expiré (401), renvoie vers la page de connexion.
 * À utiliser dans les composants client du dashboard.
 */
export function handleAdminError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 && typeof window !== "undefined") {
      // Navigation « dure » volontaire : réinitialise tout l'état client
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin/login";
    }
    return error.message;
  }
  return "Une erreur est survenue";
}
