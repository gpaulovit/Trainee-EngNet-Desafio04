"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { useTurmas } from "../../hooks/useTurmas";
import { useAlunos } from "../../hooks/useAlunos";
import AlunoForm from "../../components/alunos/AlunoForm";
import AlunosList from "../../components/alunos/AlunosList";
import toast from "react-hot-toast";
import { AlunoFormData } from "../../validations/alunoSchema";

interface Turma {
  id: string;
  nome: string;
  codigo: string;
}

interface Aluno {
  id: string;
  nome: string;
  email: string;
  matricula: string;
}

export default function GerenciarAlunosPage() {
  const router = useRouter();

  const { turmas, carregarTurmas, carregando: carregandoTurmas } = useTurmas();
  const { alunos: alunosDaTurma, carregarAlunosDaTurma, salvarAluno: apiSalvarAluno, carregando: carregandoAlunos } = useAlunos();
  
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState("");
  const [alunoEditandoId, setAlunoEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarTurmas().then((dados) => {
      if (dados && dados.length > 0) {
        setTurmaSelecionadaId(dados[0].id);
      }
    });
  }, [carregarTurmas]);

  useEffect(() => {
    if (turmaSelecionadaId) {
      carregarAlunosDaTurma(turmaSelecionadaId);
    } else {
      setAlunoEditandoId(null);
    }
  }, [turmaSelecionadaId, carregarAlunosDaTurma]);

  const limparFormulario = () => {
    setAlunoEditandoId(null);
  };

  const carregarAlunoParaEdicao = (alunoId: string) => {
    if (!alunoId) {
      limparFormulario();
      return;
    }
    setAlunoEditandoId(alunoId);
  };

  const handleSalvarAluno = async (dados: AlunoFormData) => {
    try {
      await apiSalvarAluno(
        turmaSelecionadaId,
        dados,
        alunoEditandoId
      );

      toast.success(alunoEditandoId ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
      limparFormulario();
      carregarAlunosDaTurma(turmaSelecionadaId);
    } catch (error: any) {
      console.error("Erro ao salvar aluno", error);
      toast.error(error.message || "Falha ao salvar aluno.");
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
                Gerenciar Alunos
              </h1>
              <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
                Adicione, edite e visualize os alunos matriculados nas turmas.
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

          <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
              <AlunoForm
                turmas={turmas}
                alunosDaTurma={alunosDaTurma}
                turmaSelecionadaId={turmaSelecionadaId}
                setTurmaSelecionadaId={setTurmaSelecionadaId}
                alunoEditandoId={alunoEditandoId}
                carregarAlunoParaEdicao={carregarAlunoParaEdicao}
                onSubmit={handleSalvarAluno}
                onLimpar={limparFormulario}
                carregando={carregandoAlunos}
              />
            </div>

            <div className="flex-1 w-full flex">
              <AlunosList
                turmas={turmas}
                turmaSelecionadaId={turmaSelecionadaId}
                setTurmaSelecionadaId={setTurmaSelecionadaId}
                alunos={alunosDaTurma}
                carregando={carregandoAlunos}
                onEditar={carregarAlunoParaEdicao}
                onLimparFormulario={limparFormulario}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}