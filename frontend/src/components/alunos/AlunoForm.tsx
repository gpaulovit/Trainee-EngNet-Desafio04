import React, { useEffect } from "react";
import { Days_One } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Turma } from "../../hooks/useTurmas";
import { Aluno } from "../../hooks/useAlunos";
import { alunoSchema, AlunoFormData } from "../../validations/alunoSchema";
import Spinner from "../Spinner";

const daysOne = Days_One({ weight: "400", subsets: ["latin"] });

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

  // Atualiza os valores do formulário quando entra em modo de edição ou sai dele
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
      className="flex-1 w-full max-w-[500px] mx-auto bg-gradient-to-br from-[#B53C00] to-[#8a2c00] rounded-[20px] flex flex-col items-center py-8 px-6 shadow-xl border border-[#FF8D28]/30 relative"
    >
      <h2 className={`${daysOne.className} text-xl text-white uppercase text-center tracking-widest mb-6`}>
        {alunoEditandoId ? "Editar Aluno" : "Cadastrar Aluno"}
      </h2>

      <div className="flex flex-col gap-4 w-full">
        <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Turma</label>
          <select
            value={turmaSelecionadaId}
            onChange={(e) => {
              setTurmaSelecionadaId(e.target.value);
              onLimpar();
            }}
            className="bg-transparent border-none outline-none text-sm text-black w-full"
          >
            <option value="" disabled>Selecione a turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.codigo} - {turma.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Aluno existente</label>
          <select
            value={alunoEditandoId || ""}
            onChange={(e) => carregarAlunoParaEdicao(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-black w-full"
          >
            <option value="">Novo cadastro</option>
            {alunosDaTurma.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} - {aluno.matricula}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all border border-[#4F0474]/10">
            <label className="text-[10px] font-bold text-black/45 uppercase">Nome do Aluno</label>
            <input
              type="text"
              {...register("nome")}
              className="bg-transparent border-none outline-none text-sm text-black w-full"
              placeholder="Ex: Maria Silva"
            />
          </div>
          {errors.nome && <span className="text-xs text-white/90 font-bold ml-2">{errors.nome.message}</span>}
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all border border-[#4F0474]/10">
            <label className="text-[10px] font-bold text-black/45 uppercase">E-mail</label>
            <input
              type="email"
              {...register("email")}
              className="bg-transparent border-none outline-none text-sm text-black w-full"
              placeholder="Ex: aluno@exemplo.com"
            />
          </div>
          {errors.email && <span className="text-xs text-white/90 font-bold ml-2">{errors.email.message}</span>}
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all border border-[#4F0474]/10">
            <label className="text-[10px] font-bold text-black/45 uppercase">Matrícula</label>
            <input
              type="text"
              {...register("matricula")}
              className="bg-transparent border-none outline-none text-sm text-black w-full"
              placeholder="Ex: 20260001"
            />
          </div>
          {errors.matricula && <span className="text-xs text-white/90 font-bold ml-2">{errors.matricula.message}</span>}
        </div>
      </div>

      <div className="w-full flex gap-4 mt-8">
        <button
          type="submit"
          disabled={carregando}
          className="flex-1 h-[45px] flex items-center justify-center bg-[#FF8D28] rounded-xl font-bold text-white uppercase hover:bg-[#e97714] transition-all shadow-lg active:scale-95 border border-white/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {carregando ? <Spinner className="w-5 h-5 text-white" /> : alunoEditandoId ? "Atualizar" : "Cadastrar"}
        </button>
        <button
          type="button"
          disabled={carregando}
          onClick={onLimpar}
          className="flex-1 h-[45px] bg-[#FF5CA8] rounded-xl font-bold text-white uppercase hover:bg-[#e94a96] transition-all shadow-lg active:scale-95 border border-white/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
