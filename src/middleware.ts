// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "supersecret";
const secretKey = new TextEncoder().encode(SECRET);

async function verify(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload; // ok
  } catch {
    return null;   // inválido
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  const valid = await verify(token);
  //if / => dasherboard
  if (pathname === "/") {
    if (valid) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Sem token válido e tentando entrar em páginas protegidas
  if (!valid && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Com token válido e tentando acessar login/registro -> manda pro dashboard
  if (valid && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"
  ],
};
