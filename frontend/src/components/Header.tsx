"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [saindo, setSaindo] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const temaSalvo = localStorage.getItem("theme");
    const temaInicial = temaSalvo === "dark";
    setTemaEscuro(temaInicial);
    document.documentElement.classList.toggle("dark", temaInicial);
  }, []);

  useEffect(() => {
    if (!montado) return;
    document.documentElement.classList.toggle("dark", temaEscuro);
    localStorage.setItem("theme", temaEscuro ? "dark" : "light");
  }, [temaEscuro, montado]);

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
    <header className="w-full bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto md:h-16 flex flex-col md:flex-row items-center justify-between py-4 md:py-0 gap-4 md:gap-0">
        
        <h2 className="font-serif text-2xl font-bold text-primary-900 dark:text-primary-100 text-center md:text-left">
          Zilla University
        </h2>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {[
            { name: "Home", path: "/home" },
            { name: "Turmas", path: "/turmas" },
            { name: "Alunos", path: "/alunos" },
            { name: "Controle", path: "/controle" },
            { name: "Relatórios", path: "/relatorios" },
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-sans text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <button
            type="button"
            onClick={handleLogout}
            disabled={saindo}
            className="font-sans text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors disabled:opacity-60 md:ml-4"
          >
            {saindo ? "Saindo..." : "Sair"}
          </button>

          <button
            type="button"
            onClick={() => setTemaEscuro((valor) => !valor)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors ml-2"
            aria-label={temaEscuro ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            <span className="text-sm">{temaEscuro ? "☀" : "☾"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}