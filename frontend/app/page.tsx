"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) return setErro("Por favor, preencha todos os campos.");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        credentials: "include", 
      });

      if (resposta.ok) {
        router.push("/home");
      } else {
        const dadosErro = await resposta.json();
        setErro(dadosErro.message || "Credenciais inválidas.");
      }
    } catch (error) {
      setErro("Falha ao contactar o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-degrade-zilla select-none">
      
      {/* Logos laterais mantidos mas agora usando next/image corretamente */}
      <div className="absolute left-[-150px] bottom-[-150px] w-[797px] h-[619px] pointer-events-none hidden lg:block z-0 transform -rotate-12 opacity-20">
        <Image src="/logofundo.png" alt="Fundo" fill sizes="50vw" priority className="object-contain" />
      </div>
      <div className="absolute right-[-150px] top-[-150px] w-[797px] h-[619px] pointer-events-none hidden lg:block z-0 transform rotate-12 opacity-15">
        <Image src="/logofundo.png" alt="Fundo" fill sizes="50vw" priority className="object-contain" />
      </div>

      {/* Container Original Laranja (#D06B0E) MAS responsivo (w-full max-w-[521px]) */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-[521px] min-h-[574px] bg-[#D06B0E] rounded-[18px] shadow-2xl flex flex-col items-center justify-between p-8 transition-all"
      >
        <h1 className="font-crimson text-white text-4xl font-bold tracking-wide mt-2 uppercase">
          Login
        </h1>

        <div className="w-full flex flex-col items-center gap-4 my-auto">
          <div className="w-full max-w-[386px] h-[46px]">
            <input
              type="email"
              placeholder="Usuário (e-mail)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 text-base outline-none focus:ring-4 focus:ring-[#74095A]/50 shadow-inner disabled:opacity-50"
              disabled={carregando}
            />
          </div>

          <div className="w-full max-w-[386px] h-[46px]">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 text-base outline-none focus:ring-4 focus:ring-[#74095A]/50 shadow-inner disabled:opacity-50"
              disabled={carregando}
            />
          </div>

          {erro && (
            <span className="text-white text-sm font-crimson bg-[#74095A] px-4 py-1 rounded-md text-center">
              {erro}
            </span>
          )}

          <div className="flex flex-col items-center mt-1 gap-2">
            <Link href="/esqueci-senha" className="font-crimson italic underline text-white text-sm hover:text-[#74095A] transition-colors">
              Esqueci Minha Senha
            </Link>
            <Link href="/cadastro" className="font-crimson italic underline text-white text-sm hover:text-[#74095A] transition-colors">
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </div>

        {/* Botão original Roxo */}
        <button
          type="submit"
          disabled={carregando}
          className="w-[140px] h-[54px] bg-[#74095A] rounded-[18px] text-white font-crimson font-bold text-base tracking-wider hover:bg-[#52043f] active:scale-95 transition-all shadow-lg flex items-center justify-center mb-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {carregando ? "A AGUARDAR" : "ENTRAR"}
        </button>
      </form>

      <div className="mt-6 z-10">
        <h2 className="font-aclonica text-[38px] text-white md:text-[#D06B0E] drop-shadow-md text-center">
          Zilla University
        </h2>
      </div>
    </main>
  );
}