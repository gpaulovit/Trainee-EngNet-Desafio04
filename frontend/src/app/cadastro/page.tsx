"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { cadastroSchema, CadastroFormData } from "../../validations/authSchema";

export default function Cadastro() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  const handleCadastro = async (data: CadastroFormData) => {
    setCarregando(true);

    try {
      const resposta = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: data.nome, email: data.email, senha: data.senha, perfil: "professor" }),
      });

      if (resposta.ok) {
        toast.success("Conta criada com sucesso!");
        setTimeout(() => router.push("/"), 2000);
      } else {
        const dadosErro = await resposta.json();
        if (Array.isArray(dadosErro.message)) {
          toast.error(dadosErro.message[0]);
        } else {
          toast.error(dadosErro.message || "Erro ao criar conta.");
        }
      }
    } catch (error) {
      toast.error("Falha ao contactar o servidor. Verifique o back-end.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-degrade-zilla overflow-hidden select-none">
      <form
        onSubmit={handleSubmit(handleCadastro)}
        className="relative z-10 w-full max-w-[521px] min-h-[574px] bg-[#D06B0E] rounded-[18px] shadow-2xl flex flex-col items-center justify-center p-8 transition-all gap-5"
      >
        <h1 className="font-crimson text-white text-3xl font-bold tracking-wide mb-2 text-center uppercase">
          Criar Conta
        </h1>

        <div className="w-full flex flex-col items-center gap-4 w-full">
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[386px] h-[46px]">
              <input
                type="text"
                placeholder="Nome Completo"
                {...register("nome")}
                className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 transition-all shadow-inner disabled:opacity-50"
                disabled={carregando}
              />
            </div>
            {errors.nome && <span className="text-sm font-crimson text-white bg-[#74095A] px-2 rounded mt-1">{errors.nome.message}</span>}
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[386px] h-[46px]">
              <input
                type="email"
                placeholder="E-mail Institucional"
                {...register("email")}
                className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 transition-all shadow-inner disabled:opacity-50"
                disabled={carregando}
              />
            </div>
            {errors.email && <span className="text-sm font-crimson text-white bg-[#74095A] px-2 rounded mt-1">{errors.email.message}</span>}
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[386px] h-[46px]">
              <input
                type="password"
                placeholder="Senha (mínimo 6 caracteres)"
                {...register("senha")}
                className="w-full h-full px-5 bg-white rounded-[18px] font-crimson text-black placeholder-black/60 outline-none focus:ring-4 focus:ring-[#74095A]/50 transition-all shadow-inner disabled:opacity-50"
                disabled={carregando}
              />
            </div>
            {errors.senha && <span className="text-sm font-crimson text-white bg-[#74095A] px-2 rounded mt-1">{errors.senha.message}</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={carregando}
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