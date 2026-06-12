"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!email) {
      setErro("Por favor, introduza o seu e-mail.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (resposta.ok) {
        setMensagem("Se o e-mail existir no sistema, receberá as instruções. (Para testes locais, verifique o terminal do back-end).");
        // Opcional: Redireciona automaticamente de volta ao login após 6 segundos
        setTimeout(() => router.push("/"), 6000); 
      } else {
        const dadosErro = await resposta.json();
        setErro(dadosErro.message || "Erro ao solicitar recuperação.");
      }
    } catch (error) {
      setErro("Falha ao contactar o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-degrade-zilla overflow-hidden select-none">
      <form
        onSubmit={handleRecuperar}
        className="relative z-10 w-full max-w-[521px] min-h-[400px] bg-[#D06B0E] rounded-[18px] shadow-2xl flex flex-col items-center justify-center p-8 transition-all gap-4"
      >
        <h1 className="font-crimson text-white text-3xl font-bold tracking-wide mb-2 text-center">
          RECUPERAR SENHA
        </h1>

        <p className="font-crimson text-white text-center text-base mb-4 px-4">
          Introduza o seu e-mail institucional. Enviaremos as instruções de recuperação para o seu endereço.
        </p>

        <div className="w-full max-w-[386px] h-[46px]">
          <input
            type="email"
            placeholder="O seu e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 disabled:opacity-50 transition-all shadow-inner"
            disabled={carregando}
          />
        </div>

        {erro && (
          <span className="text-white text-sm font-crimson bg-[#900B09] px-4 py-1 rounded-md shadow-md">
            {erro}
          </span>
        )}
        
        {mensagem && (
          <span className="text-white text-sm font-crimson bg-[#14AE5C] px-4 py-2 rounded-md shadow-md text-center">
            {mensagem}
          </span>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-[140px] h-[54px] mt-4 bg-[#74095A] rounded-[18px] text-white font-crimson font-bold text-base hover:bg-[#52043f] active:scale-95 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {carregando ? "A ENVIAR..." : "ENVIAR"}
        </button>

        <Link 
          href="/" 
          className="font-crimson italic underline text-white text-sm hover:text-[#74095A] transition-colors mt-2"
        >
          Voltar ao Login
        </Link>
      </form>
    </main>
  );
}