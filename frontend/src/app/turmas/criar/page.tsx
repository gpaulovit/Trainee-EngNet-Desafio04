"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Header from "../../../components/Header";
import { turmaSchema, TurmaFormData } from "../../../validations/turmaSchema";
import { api } from "../../../services/apiClient"; // Certifique-se deste caminho

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

  useEffect(() => {
    const turmaSalva = sessionStorage.getItem("turmaEdicao");
    if (turmaSalva) {
      const turma = JSON.parse(turmaSalva);
      const partes = (turma.horario || "08:00 - 10:00").split(" - ");
      
      setIdEditando(turma.id);
      
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
  }, [reset]);

  const handleCriarTurma = async (data: TurmaFormData) => {
    try {
      const payload = {
        nome: data.nome,
        codigo: data.codigo,
        curso: data.curso,
        capacidade: Number(data.capacidade),
        horario: `${data.horaInicio} - ${data.horaFim}`,
      };

      if (idEditando) {
        await api.patch(`/turmas/${idEditando}`, payload);
        toast.success("Turma atualizada com sucesso!");
      } else {
        await api.post("/turmas", payload);
        toast.success("Turma criada com sucesso!");
      }

      setTimeout(() => router.push("/turmas"), 800);
    } catch (error: any) {
      const mensagem = error.data?.message || "Erro ao processar turma";
      toast.error(Array.isArray(mensagem) ? mensagem[0] : mensagem);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <main className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                {idEditando ? "Editar Turma" : "Criar Nova Turma"}
              </h1>
              <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
                {idEditando ? "Atualize os dados da turma selecionada" : "Insira as informações para cadastrar uma turma"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/turmas")}
              className="h-10 px-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg font-sans font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm shrink-0"
            >
              Voltar para Turmas
            </button>
          </div>

          <div className="w-full flex flex-col lg:flex-row items-start gap-8">
            <form onSubmit={handleSubmit(handleCriarTurma)} className="flex-1 w-full max-w-[500px] bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex flex-col gap-5 w-full font-sans">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Turma</label>
                  <input type="text" {...register("nome")} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Ex: Engenharia" />
                  {errors.nome && <span className="text-xs font-medium text-red-500 mt-1">{errors.nome.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Curso de Destino</label>
                  <input type="text" {...register("curso")} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Ex: Tecnologia" />
                </div>

                <div className="flex w-full gap-4">
                  <div className="flex-1 flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
                    <input type="text" {...register("codigo")} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-mono uppercase" placeholder="Ex: ES-2026" />
                    {errors.codigo && <span className="text-xs font-medium text-red-500 mt-1">{errors.codigo.message}</span>}
                  </div>
                  <div className="w-[120px] shrink-0 flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vagas</label>
                    <input type="number" min="1" {...register("capacidade")} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center" />
                    {errors.capacidade && <span className="text-xs font-medium text-red-500 mt-1">{errors.capacidade.message}</span>}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Horário de Aula</label>
                  <div className="flex items-center gap-3">
                    <input type="time" {...register("horaInicio")} className="flex-1 h-10 px-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white text-sm" />
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">até</span>
                    <input type="time" {...register("horaFim")} className="flex-1 h-10 px-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white text-sm" />
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-3 mt-8">
                <button type="submit" className="flex-1 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-sans font-medium text-sm transition-colors shadow-sm">
                  {idEditando ? "Atualizar Turma" : "Criar Turma"}
                </button>
                <button type="button" onClick={() => router.push("/turmas")} className="flex-1 h-11 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-sans font-medium text-sm transition-colors shadow-sm">
                  Cancelar
                </button>
              </div>
            </form>
            
            <div className="flex-1 w-full lg:max-w-sm bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">Gestão de Alunos</h3>
              <p className="font-sans text-sm text-primary-700 dark:text-primary-300 mb-6">Para adicionar ou remover alunos de uma turma, navegue até a seção dedicada de alunos.</p>
              <button type="button" onClick={() => router.push("/alunos")} className="w-full h-10 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg font-sans font-medium text-sm transition-colors shadow-sm mt-auto">Ir para Alunos</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}