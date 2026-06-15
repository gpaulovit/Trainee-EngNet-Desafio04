"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [saindo, setSaindo] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem("theme");
    const temaInicial = temaSalvo === "dark";
    setTemaEscuro(temaInicial);
    document.documentElement.classList.toggle("dark", temaInicial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", temaEscuro);
    localStorage.setItem("theme", temaEscuro ? "dark" : "light");
  }, [temaEscuro]);

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    setSaindo(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setSaindo(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="w-full bg-black/95 shadow-lg border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto md:h-20 flex flex-col md:flex-row items-center justify-between py-4 md:py-0 gap-4 md:gap-0">
        
        <h2 className="font-aclonica text-2xl text-white drop-shadow-sm text-center md:text-left">
          Zilla University
        </h2>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <Link
            href="/home"
            className={`font-crimson text-xl font-normal underline uppercase tracking-wider transition-colors ${
              isActive("/home") ? "text-[#FF8D28]" : "text-white hover:text-[#FF8D28]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/turmas"
            className={`font-crimson text-xl font-normal underline uppercase tracking-wider transition-colors ${
              isActive("/turmas") ? "text-[#FF8D28]" : "text-white hover:text-[#FF8D28]"
            }`}
          >
            Turma
          </Link>
          <Link
            href="/alunos"
            className={`font-crimson text-xl font-normal underline uppercase tracking-wider transition-colors ${
              isActive("/alunos") ? "text-[#FF8D28]" : "text-white hover:text-[#FF8D28]"
            }`}
          >
            Alunos
          </Link>
          <Link
            href="/controle"
            className={`font-crimson text-xl font-normal underline uppercase tracking-wider transition-colors ${
              isActive("/controle") ? "text-[#FF8D28]" : "text-white hover:text-[#FF8D28]"
            }`}
          >
            Controle
          </Link>
          <Link
            href="/relatorios"
            className={`font-crimson text-xl font-normal underline uppercase tracking-wider transition-colors ${
              isActive("/relatorios") ? "text-[#FF8D28]" : "text-white hover:text-[#FF8D28]"
            }`}
          >
            Relatórios
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={saindo}
            className="font-crimson text-xl font-normal underline uppercase tracking-wider transition-colors text-[#FF8D28] hover:text-white disabled:opacity-60"
          >
            {saindo ? "Saindo..." : "Sair"}
          </button>

          <button
            type="button"
            onClick={() => setTemaEscuro((valor) => !valor)}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 font-crimson text-base text-white hover:bg-white/20 transition-colors"
            aria-label={temaEscuro ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            <span className="text-lg">{temaEscuro ? "☀" : "☾"}</span>
            <span>{temaEscuro ? "Claro" : "Escuro"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}