export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Côté serveur (SSR) on appelle directement le backend ; côté navigateur on passe par
// le même domaine (/api/* est relayé par Next.js vers FastAPI).
const BASE =
  typeof window === "undefined" ? (process.env.API_INTERNAL_URL ?? "http://localhost:8000") : "";

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d) => {
          const loc = Array.isArray(d?.loc) ? d.loc.filter((p: string) => p !== "body").join(".") : "";
          return loc ? `${loc} : ${d?.msg}` : String(d?.msg ?? "");
        })
        .join(" — ");
    }
  }
  return fallback;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  formData?: FormData;
  /** En-tête Cookie à relayer (utilisé uniquement par les composants serveur) */
  cookie?: string;
}

export async function api<T = void>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, formData, cookie, headers, ...init } = options;
  const finalHeaders = new Headers(headers);
  let body: BodyInit | undefined;

  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData; // le navigateur ajoute le boundary multipart
  }
  if (cookie) finalHeaders.set("Cookie", cookie);

  let response: Response;
  try {
    response = await fetch(`${BASE}/api${path}`, {
      ...init,
      headers: finalHeaders,
      body,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Impossible de joindre le serveur");
  }

  if (!response.ok) {
    let parsed: unknown = null;
    try {
      parsed = await response.json();
    } catch {
      /* corps non JSON */
    }
    throw new ApiError(response.status, extractMessage(parsed, `Erreur ${response.status}`));
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
