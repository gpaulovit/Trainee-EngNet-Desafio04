"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { esqueciSenhaSchema, EsqueciSenhaFormData } from "../../validations/authSchema";

export default function EsqueciSenha() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EsqueciSenhaFormData>({
    resolver: zodResolver(esqueciSenhaSchema),
  });

  const handleRecuperar = async (data: EsqueciSenhaFormData) => {
    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (resposta.ok) {
        toast.success("Se o e-mail existir no sistema, você receberá as instruções.");
        // Opcional: Redireciona automaticamente de volta ao login após 6 segundos
        setTimeout(() => router.push("/"), 6000); 
      } else {
        const dadosErro = await resposta.json();
        toast.error(dadosErro.message || "Erro ao solicitar recuperação.");
      }
    } catch (error) {
      toast.error("Falha ao contactar o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-degrade-zilla overflow-hidden select-none">
      <form
        onSubmit={handleSubmit(handleRecuperar)}
        className="relative z-10 w-full max-w-[521px] min-h-[574px] bg-[#D06B0E] rounded-[18px] shadow-2xl flex flex-col items-center justify-center p-8 transition-all gap-6"
      >
        <h1 className="font-crimson text-white text-3xl font-bold tracking-wide mb-2 text-center">
          RECUPERAR SENHA
        </h1>

        <p className="font-crimson text-white text-center text-base mb-4 px-4">
          Introduza o seu e-mail institucional. Enviaremos as instruções de recuperação para o seu endereço.
        </p>

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