import { cookies } from "next/headers";

import { api, type RequestOptions } from "@/lib/api";

/** Appel API depuis un composant serveur, en relayant le cookie de session du visiteur. */
export async function serverApi<T = void>(path: string, options: RequestOptions = {}): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  return api<T>(path, { ...options, cookie: cookieHeader });
}
