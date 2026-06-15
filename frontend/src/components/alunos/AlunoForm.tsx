import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Turma } from "../../hooks/useTurmas";
import { Aluno } from "../../hooks/useAlunos";
import { alunoSchema, AlunoFormData } from "../../validations/alunoSchema";
import Spinner from "../Spinner";

interface AlunoFormProps {
  turmas: Turma[];
  alunosDaTurma: Aluno[];
  turmaSelecionadaId: string;
  setTurmaSelecionadaId: (id: string) => void;
  alunoEditandoId: string | null;
  carregarAlunoParaEdicao: (id: string) => void;
  onSubmit: (dados: AlunoFormData) => void;
  onLimpar: () => void;
  carregando: boolean;
}

export default function AlunoForm({
  turmas,
  alunosDaTurma,
  turmaSelecionadaId,
  setTurmaSelecionadaId,
  alunoEditandoId,
  carregarAlunoParaEdicao,
  onSubmit,
  onLimpar,
  carregando,
}: AlunoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: { nome: "", email: "", matricula: "" },
  });

  useEffect(() => {
    if (alunoEditandoId) {
      const aluno = alunosDaTurma.find((a) => a.id === alunoEditandoId);
      if (aluno) {
        reset({
          nome: aluno.nome,
          email: aluno.email,
          matricula: aluno.matricula,
        });
      }
    } else {
      reset({ nome: "", email: "", matricula: "" });
    }
  }, [alunoEditandoId, alunosDaTurma, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 w-full max-w-[500px] mx-auto bg-white dark:bg-slate-800 rounded-2xl flex flex-col py-6 px-6 shadow-sm border border-gray-200 dark:border-slate-700 relative transition-colors duration-300"
    >
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
          {alunoEditandoId ? "Editar Aluno" : "Cadastrar Aluno"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
          {alunoEditandoId ? "Atualize os dados do aluno selecionado" : "Preencha os dados para adicionar um novo aluno"}
        </p>
      </div>

      <div className="flex flex-col gap-5 w-full font-sans">
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Turma
          </label>
          <select
            value={turmaSelecionadaId}
            onChange={(e) => {
              setTurmaSelecionadaId(e.target.value);
              onLimpar();
            }}
            className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
          >
            <option value="" disabled>Selecione a turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.codigo} - {turma.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Aluno Existente (Edição)
          </label>
          <select
            value={alunoEditandoId || ""}
            onChange={(e) => carregarAlunoParaEdicao(e.target.value)}
            className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
          >
            <option value="">Novo Cadastro</option>
            {alunosDaTurma.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} - {aluno.matricula}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Aluno
          </label>
          <input
            type="text"
            {...register("nome")}
            className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            placeholder="Ex: Maria Silva"
          />
          {errors.nome && <span className="text-xs font-medium text-red-500 mt-1">{errors.nome.message}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-mail
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            placeholder="Ex: aluno@exemplo.com"
          />
          {errors.email && <span className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Matrícula
          </label>
          <input
            type="text"
            {...register("matricula")}
            className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            placeholder="Ex: 20260001"
          />
          {errors.matricula && <span className="text-xs font-medium text-red-500 mt-1">{errors.matricula.message}</span>}
        </div>
      </div>

      <div className="w-full flex gap-3 mt-6">
        <button
          type="submit"
          disabled={carregando}
          className="flex-1 h-11 flex items-center justify-center bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg font-sans font-medium text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {carregando ? <Spinner className="w-5 h-5 text-white" /> : alunoEditandoId ? "Atualizar" : "Cadastrar"}
        </button>
        <button
          type="button"
          disabled={carregando}
          onClick={onLimpar}
          className="flex-1 h-11 flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 rounded-lg font-sans font-medium text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
