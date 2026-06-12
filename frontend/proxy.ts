import { NextResponse, type NextRequest } from "next/server";

const rotasProtegidas = ["/home", "/turmas", "/alunos", "/controle", "/relatorios"];
const rotasPublicas = ["/", "/cadastro", "/esqueci-senha"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtegida = rotasProtegidas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));
  const isPublica = rotasPublicas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));

  if (!token && isProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (token && isPublica) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};