"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../components/Header";
import { useTurmas } from "../../hooks/useTurmas";
import { useAlunos } from "../../hooks/useAlunos";
import AlunoForm from "../../components/alunos/AlunoForm";
import AlunosList from "../../components/alunos/AlunosList";
import toast from "react-hot-toast";
import { AlunoFormData } from "../../validations/alunoSchema";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

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
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col pt-8 px-4 md:px-8 pb-20 shadow-2xl relative">
          <div className="w-full flex justify-between items-center gap-4 mb-6 flex-wrap">
            <h1 className={`${daysOne.className} text-3xl text-black uppercase tracking-wider text-center`}>
              GERENCIAR ALUNOS
            </h1>
            <button
              type="button"
              onClick={() => router.push("/turmas")}
              className="h-[45px] px-5 bg-[#4F0474] rounded-xl font-bold text-white uppercase hover:bg-[#3b0358] transition-all shadow-lg active:scale-95"
            >
              Voltar para Turmas
            </button>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-8">
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
        </main>
      </div>
    </div>
  );
}