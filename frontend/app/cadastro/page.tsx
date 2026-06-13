"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha, perfil: "professor" }),
      });

      if (resposta.ok) {
        setSucesso(true);
        setTimeout(() => router.push("/"), 2000);
      } else {
        const dadosErro = await resposta.json();
        if (Array.isArray(dadosErro.message)) {
          setErro(dadosErro.message[0]);
        } else {
          setErro(dadosErro.message || "Erro ao criar conta.");
        }
      }
    } catch (error) {
      setErro("Falha ao contactar o servidor. Verifique o back-end.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-degrade-zilla overflow-hidden select-none">
      <form
        onSubmit={handleCadastro}
        className="relative z-10 w-full max-w-[521px] min-h-[574px] bg-[#D06B0E] rounded-[18px] shadow-2xl flex flex-col items-center justify-center p-8 transition-all gap-5"
      >
        <h1 className="font-crimson text-white text-3xl font-bold tracking-wide mb-2 text-center uppercase">
          Criar Conta
        </h1>

        <div className="w-full flex flex-col items-center gap-4 w-full">
          <div className="w-full max-w-[386px] h-[46px]">
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 transition-all shadow-inner disabled:opacity-50"
              disabled={carregando || sucesso}
            />
          </div>

          <div className="w-full max-w-[386px] h-[46px]">
            <input
              type="email"
              placeholder="E-mail Institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 transition-all shadow-inner disabled:opacity-50"
              disabled={carregando || sucesso}
            />
          </div>

          <div className="w-full max-w-[386px] h-[46px]">
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 transition-all shadow-inner disabled:opacity-50"
              disabled={carregando || sucesso}
            />
          </div>

          {erro && (
            <span className="text-white text-sm font-crimson bg-[#900B09] px-4 py-1 rounded-md shadow-md text-center w-full max-w-[386px]">
              {erro}
            </span>
          )}

          {sucesso && (
            <span className="text-white text-sm font-crimson bg-[#14AE5C] px-4 py-2 rounded-md shadow-md text-center w-full max-w-[386px]">
              Conta criada com sucesso! Redirecionando para o login...
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={carregando || sucesso}
          className="w-[140px] h-[54px] mt-2 bg-[#74095A] rounded-[18px] text-white font-crimson font-bold text-base hover:bg-[#52043f] active:scale-95 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {carregando ? "A SALVAR..." : "CADASTRAR"}
        </button>

        <Link
          href="/"
          className="font-crimson italic underline text-white text-sm hover:text-[#74095A] transition-colors mt-2"
        >
          Já possui conta? Faça o Login
        </Link>
      </form>
    </main>
  );
}