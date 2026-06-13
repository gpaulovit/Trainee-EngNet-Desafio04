"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../components/Header";

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

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState("");
  const [alunosDaTurma, setAlunosDaTurma] = useState<Aluno[]>([]);
  const [alunoEditandoId, setAlunoEditandoId] = useState<string | null>(null);
  const [nomeAluno, setNomeAluno] = useState("");
  const [emailAluno, setEmailAluno] = useState("");
  const [matriculaAluno, setMatriculaAluno] = useState("");
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean }>({
    texto: "",
    erro: false,
  });

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const resposta = await fetch("/api/turmas", {
          credentials: "include",
        });

        if (!resposta.ok) return;

        const dados: Turma[] = await resposta.json();
        setTurmas(dados);

        if (dados.length > 0) {
          setTurmaSelecionadaId(dados[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar turmas", error);
      }
    };

    carregarTurmas();
  }, []);

  useEffect(() => {
    const carregarAlunosDaTurma = async () => {
      if (!turmaSelecionadaId) {
        setAlunosDaTurma([]);
        setAlunoEditandoId(null);
        return;
      }

      try {
        const resposta = await fetch(`/api/alunos/turma/${turmaSelecionadaId}`, {
          credentials: "include",
        });

        if (!resposta.ok) {
          setAlunosDaTurma([]);
          setAlunoEditandoId(null);
          return;
        }

        const dados: Aluno[] = await resposta.json();
        setAlunosDaTurma(dados);
      } catch (error) {
        console.error("Erro ao carregar alunos da turma", error);
        setAlunosDaTurma([]);
        setAlunoEditandoId(null);
      }
    };

    carregarAlunosDaTurma();
  }, [turmaSelecionadaId]);

  const limparFormulario = () => {
    setAlunoEditandoId(null);
    setNomeAluno("");
    setEmailAluno("");
    setMatriculaAluno("");
  };

  const carregarAlunoParaEdicao = (alunoId: string) => {
    if (!alunoId) {
      limparFormulario();
      return;
    }

    const aluno = alunosDaTurma.find((item) => item.id === alunoId);
    if (!aluno) return;

    setAlunoEditandoId(aluno.id);
    setNomeAluno(aluno.nome);
    setEmailAluno(aluno.email);
    setMatriculaAluno(aluno.matricula);
  };

  const handleSalvarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ texto: "A processar...", erro: false });

    try {
      const metodo = alunoEditandoId ? "PATCH" : "POST";
      const url = alunoEditandoId ? `/api/alunos/${alunoEditandoId}` : "/api/alunos";

      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeAluno,
          email: emailAluno,
          matricula: matriculaAluno,
          turmaId: turmaSelecionadaId,
        }),
        credentials: "include",
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem({
          texto: alunoEditandoId ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!",
          erro: false,
        });
        limparFormulario();

        const respostaAlunos = await fetch(`/api/alunos/turma/${turmaSelecionadaId}`, {
          credentials: "include",
        });

        if (respostaAlunos.ok) {
          setAlunosDaTurma(await respostaAlunos.json());
        }
      } else {
        const mensagemErro = Array.isArray(dados.message)
          ? dados.message[0]
          : dados.message || "Erro ao cadastrar aluno";
        setMensagem({ texto: mensagemErro, erro: true });
      }
    } catch (error) {
      console.error("Erro ao salvar aluno", error);
      setMensagem({ texto: "Falha de ligação ao servidor.", erro: true });
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
            <form
              onSubmit={handleSalvarAluno}
              className="flex-1 w-full max-w-[500px] mx-auto bg-gradient-to-br from-[#B53C00] to-[#8a2c00] rounded-[20px] flex flex-col items-center py-8 px-6 shadow-xl border border-[#FF8D28]/30"
            >
              <h2 className={`${daysOne.className} text-xl text-white uppercase text-center tracking-widest mb-6`}>
                {alunoEditandoId ? "Editar Aluno" : "Cadastrar Aluno"}
              </h2>

              {mensagem.texto && (
                <div
                  className={`w-full mb-6 p-4 rounded-xl text-sm font-bold text-center border-2 ${
                    mensagem.erro ? "bg-white text-red-600 border-red-600" : "bg-green-100 text-green-700 border-green-500"
                  }`}
                >
                  {mensagem.texto}
                </div>
              )}

              <div className="flex flex-col gap-4 w-full">
                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Turma</label>
                  <select
                    value={turmaSelecionadaId}
                    onChange={(e) => {
                      setTurmaSelecionadaId(e.target.value);
                      limparFormulario();
                    }}
                    className="bg-transparent border-none outline-none text-sm text-black w-full"
                  >
                    <option value="" disabled>
                      Selecione a turma
                    </option>
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

                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all border border-[#4F0474]/10">
                  <label className="text-[10px] font-bold text-black/45 uppercase">Nome do Aluno</label>
                  <input
                    type="text"
                    value={nomeAluno}
                    onChange={(e) => setNomeAluno(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-black w-full"
                    placeholder="Ex: Maria Silva"
                  />
                </div>

                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all border border-[#4F0474]/10">
                  <label className="text-[10px] font-bold text-black/45 uppercase">E-mail</label>
                  <input
                    type="email"
                    value={emailAluno}
                    onChange={(e) => setEmailAluno(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-black w-full"
                    placeholder="Ex: aluno@exemplo.com"
                  />
                </div>

                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all border border-[#4F0474]/10">
                  <label className="text-[10px] font-bold text-black/45 uppercase">Matrícula</label>
                  <input
                    type="text"
                    value={matriculaAluno}
                    onChange={(e) => setMatriculaAluno(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-black w-full"
                    placeholder="Ex: 20260001"
                  />
                </div>
              </div>

              <div className="w-full flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 h-[45px] bg-[#FF8D28] rounded-xl font-bold text-white uppercase hover:bg-[#e97714] transition-all shadow-lg active:scale-95 border border-white/20"
                >
                  {alunoEditandoId ? "Atualizar" : "Cadastrar"}
                </button>
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="flex-1 h-[45px] bg-[#FF5CA8] rounded-xl font-bold text-white uppercase hover:bg-[#e94a96] transition-all shadow-lg active:scale-95 border border-white/20"
                >
                  Limpar
                </button>
              </div>
            </form>

            <div className="flex-1 bg-gradient-to-br from-[#4F0474] via-[#3a0259] to-[#1b1026] rounded-[20px] flex flex-col pt-6 px-4 md:px-8 pb-8 shadow-inner border border-[#FF8D28]/30">
              <div className="w-full h-[54px] bg-white/95 rounded-xl flex items-center px-4 shadow-md mb-6 shrink-0 relative focus-within:ring-2 focus-within:ring-[#FF8D28] border border-[#FF8D28]/20">
                <select
                  value={turmaSelecionadaId}
                  onChange={(e) => {
                    setTurmaSelecionadaId(e.target.value);
                    limparFormulario();
                  }}
                  className="w-full h-full bg-transparent border-none outline-none font-sans font-semibold text-sm text-gray-800 cursor-pointer appearance-none"
                >
                  <option value="" disabled hidden>
                    Selecione a turma para ver os alunos...
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.codigo} - {turma.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 bg-white/95 min-h-[360px] overflow-y-auto shadow-md p-4 flex flex-col gap-2 rounded-xl custom-scrollbar border border-[#FF8D28]/20">
                <h4 className="font-sans text-xs font-bold text-black/45 uppercase tracking-wider mb-2 pb-2 border-b border-[#FF8D28]/20">
                  Alunos Matriculados
                </h4>
                {turmaSelecionadaId ? (
                  alunosDaTurma.length > 0 ? (
                    alunosDaTurma.map((aluno, index) => (
                      <div
                        key={aluno.id}
                        className="w-full flex items-center justify-between gap-4 font-crimson text-sm sm:text-base text-black py-2 px-3 bg-[#f7edf9] border border-[#FF8D28]/20 rounded-lg hover:bg-[#f9d9ea] transition-colors"
                      >
                        <span>
                          <span className="font-semibold text-[#4F0474] mr-2">{String(index + 1).padStart(2, "0")}. </span>
                          {aluno.nome}
                        </span>
                        <button
                          type="button"
                          onClick={() => carregarAlunoParaEdicao(aluno.id)}
                          className="text-xs font-bold text-[#FF8D28] uppercase hover:underline"
                        >
                          Editar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="font-sans text-sm italic text-black/35">Nenhum aluno cadastrado nesta turma.</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="font-sans text-sm italic text-black/35">Selecione uma turma para ver os alunos.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}