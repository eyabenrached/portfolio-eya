import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "access_token";

/**
 * Première barrière : sans cookie de session, /admin/* redirige vers le login.
 * La vraie vérification (signature + expiration du JWT) est faite par le backend
 * à chaque appel API et par le layout du dashboard (voir app/admin/(dashboard)/layout.tsx).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.get(COOKIE_NAME)?.value) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
