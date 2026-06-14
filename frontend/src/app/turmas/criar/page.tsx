"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Header from "../../../components/Header";
import { turmaSchema, TurmaFormData } from "../../../validations/turmaSchema";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function CriarEditarTurma() {
  const router = useRouter();

  const [idEditando, setIdEditando] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TurmaFormData>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      curso: "",
      capacidade: "30",
      horaInicio: "08:00",
      horaFim: "18:00",
    },
  });

  // Se entrar na página vindo do botão "Editar", preenche os campos
  useEffect(() => {
    const timer = setTimeout(() => {
      const turmaSalva = sessionStorage.getItem("turmaEdicao");
      if (turmaSalva) {
        const turma = JSON.parse(turmaSalva);
        const partes = (turma.horario || "08:00 - 10:00").split(" - ");
        
        reset({
          nome: turma.nome,
          codigo: turma.codigo,
          curso: turma.curso || "",
          capacidade: String(turma.capacidade || 30),
          horaInicio: partes[0] || "08:00",
          horaFim: partes[1] || "10:00",
        });
        
        sessionStorage.removeItem("turmaEdicao");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);
 

  const handleCriarTurma = async (data: TurmaFormData) => {

    try {
      // Define URL e Método consoante seja Criação (POST) ou Edição (PATCH)
      const urlAcesso = idEditando 
        ? `/api/turmas/${idEditando}` 
        : "/api/turmas";
      const metodoHttp = idEditando ? "PATCH" : "POST";

      const resposta = await fetch(urlAcesso, {
        method: metodoHttp,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          codigo: data.codigo,
          curso: data.curso,
          capacidade: Number(data.capacidade), 
          horario: `${data.horaInicio} - ${data.horaFim}`, 
        }),
        credentials: "include",
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        toast.success(idEditando ? "Turma atualizada com sucesso!" : "Turma criada com sucesso!");
        // Espera um pouco para o utilizador ler a mensagem de sucesso e redireciona
        setTimeout(() => router.push("/turmas"), 800);
      } else {
        toast.error(dados.message || "Erro ao processar turma");
      }
    } catch (error) {
      toast.error("Falha de ligação ao servidor.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col pt-8 px-4 md:px-8 pb-20 shadow-2xl relative">
          
          <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-8 mb-6">
            
            {/* FORMULÁRIO DE TURMA (Laranja) */}
            <form onSubmit={handleSubmit(handleCriarTurma)} className="flex-1 w-full max-w-[450px] mx-auto bg-gradient-to-br from-[#B53C00] to-[#8a2c00] rounded-[20px] flex flex-col items-center py-8 px-6 shadow-xl border border-[#FF8D28]/30">
              
              <h2 className={`${daysOne.className} text-xl text-white uppercase text-center tracking-widest mb-6`}>
                Criar / Editar Turmas
              </h2>

              <div className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div className="w-full flex flex-col gap-1">
                  <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nome da Turma</label>
                    <input type="text" {...register("nome")} className="bg-transparent border-none outline-none text-sm text-black w-full" placeholder="Ex: Engenharia" />
                  </div>
                  {errors.nome && <span className="text-xs text-white/90 font-bold ml-2">{errors.nome.message}</span>}
                </div>

                {/* Curso */}
                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Curso de Destino</label>
                  <input type="text" {...register("curso")} className="bg-transparent border-none outline-none text-sm text-black w-full" placeholder="Ex: Tecnologia" />
                </div>

                <div className="flex w-full gap-4">
                  {/* Código */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                      <label className="font-crimson text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">
                        Código da Turma
                      </label>
                      <input 
                        type="text" 
                        {...register("codigo")}
                        className="bg-transparent border-none outline-none font-sans text-sm text-black font-mono uppercase placeholder-gray-400 w-full" 
                        placeholder="Ex: ES-2026" 
                      />
                    </div>
                    {errors.codigo && <span className="text-xs text-white/90 font-bold ml-2">{errors.codigo.message}</span>}
                  </div>

                  {/* Vagas */}
                  <div className="w-[110px] shrink-0 flex flex-col gap-1">
                    <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                      <label className="font-crimson text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">
                        Vagas
                      </label>
                      <input 
                        type="number" 
                        min="1" 
                        {...register("capacidade")}
                        className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-400 w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-center" 
                      />
                    </div>
                    {errors.capacidade && <span className="text-xs text-white/90 font-bold ml-2">{errors.capacidade.message}</span>}
                  </div>
                </div>

                {/* Horário Formatado (Início - Fim) */}
                <div className="w-full p-3 bg-white rounded-xl shadow-md">
                   <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Horários de Aula</label>
                   <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <input type="time" {...register("horaInicio")} className="w-full bg-gray-50 p-1 rounded border text-sm outline-none focus:border-[#FF8D28]" />
                      </div>
                      <span className="text-gray-400 text-xs font-bold uppercase">até</span>
                      <div className="flex-1 flex flex-col gap-1">
                        <input type="time" {...register("horaFim")} className="w-full bg-gray-50 p-1 rounded border text-sm outline-none focus:border-[#FF8D28]" />
                      </div>
                   </div>
                   {(errors.horaInicio || errors.horaFim) && <span className="text-xs text-red-500 font-bold ml-2 mt-1 block">Preencha os horários corretamente</span>}
                </div>
              </div>

              <div className="w-full flex justify-between gap-4 mt-8">
                {/* O botão muda de nome dinamicamente */}
                <button type="submit" className="flex-1 h-[45px] bg-[#14AE5C] rounded-xl font-bold text-white uppercase hover:bg-[#0f8c4a] transition-all shadow-lg active:scale-95">
                  {idEditando ? "Atualizar" : "Criar"}
                </button>
                <button type="button" onClick={() => router.push("/turmas")} className="flex-1 h-[45px] bg-[#900B09] rounded-xl font-bold text-white uppercase hover:bg-[#700605] transition-all shadow-lg active:scale-95">
                  Cancelar
                </button>
              </div>
            </form>

            <div className="flex-1 w-full max-w-[450px] mx-auto bg-gradient-to-br from-[#4F0474] via-[#2c0242] to-[#B53C00] rounded-[20px] flex flex-col items-center justify-center py-8 px-6 shadow-xl border border-[#FF8D28]/30">
              <h2 className={`${daysOne.className} text-xl text-white uppercase text-center tracking-widest mb-4`}>
                Alunos em Página Dedicada
              </h2>
              <p className="text-sm text-white/80 text-center mb-6">
                A gestão de alunos foi movida para a rota própria.
              </p>
              <button
                type="button"
                onClick={() => router.push("/alunos")}
                className="w-full h-[45px] bg-[#FF8D28] rounded-xl font-bold text-white uppercase hover:bg-[#e97714] transition-all shadow-lg active:scale-95 border border-white/20"
              >
                Ir para Alunos
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}