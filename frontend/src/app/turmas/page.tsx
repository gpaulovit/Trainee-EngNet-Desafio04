"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

interface Turma {
  id: string;
  nome: string;
  codigo: string;
  horario: string;
  curso?: string;
  capacidade?: number;
  qtdAlunos?: number;
  raw?: TurmaApiRaw;
}

interface TurmaApiRaw {
  id?: string;
  nome?: string;
  codigo?: string;
  horario?: string;
  curso?: string;
  capacidade?: number;
  qtdAlunos?: number | string;
  qtdalunos?: number | string;
  qtd_alunos?: number | string;
  alunosQtd?: number | string;
  count?: number | string;
  turma_id?: string;
  turma_nome?: string;
  turma_codigo?: string;
  turma_horario?: string;
  turma_curso?: string;
  turma_capacidade?: number;
}

interface AlunoDaTurma {
  id: string;
  nome: string;
}

export default function Turmas() {
  const router = useRouter();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [alunosDoBanco, setAlunosDoBanco] = useState<AlunoDaTurma[]>([]);
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean }>({ texto: "", erro: false });

  const parseQtdAlunos = (raw: TurmaApiRaw): number | undefined => {
    const valorBruto = raw.qtdAlunos ?? raw.qtdalunos ?? raw.qtd_alunos ?? raw.alunosQtd ?? raw.count;
    if (valorBruto === undefined || valorBruto === null || valorBruto === "") {
      return undefined;
    }

    const valorNumero = Number(valorBruto);
    return Number.isNaN(valorNumero) ? undefined : valorNumero;
  };

  const normalizarTurma = (raw: TurmaApiRaw): Turma => ({
    id: raw.id ?? raw.turma_id ?? "",
    nome: raw.nome ?? raw.turma_nome ?? "",
    codigo: raw.codigo ?? raw.turma_codigo ?? "",
    horario: raw.horario ?? raw.turma_horario ?? "",
    curso: raw.curso ?? raw.turma_curso,
    capacidade: raw.capacidade ?? raw.turma_capacidade,
    qtdAlunos: parseQtdAlunos(raw),
    raw,
  });

  const buscarAlunosDaTurma = async (turmaId: string) => {
    try {
      const resposta = await fetch(`/api/alunos/turma/${turmaId}`, {
        credentials: "include",
      });

      if (!resposta.ok) {
        setAlunosDoBanco([]);
        setMensagem({ texto: "Não foi possível carregar os alunos da turma.", erro: true });
        return;
      }

      const dados: AlunoDaTurma[] = await resposta.json();
      setAlunosDoBanco(dados);
    } catch (error) {
      console.error("Erro ao buscar alunos da turma", error);
      setAlunosDoBanco([]);
      setMensagem({ texto: "Falha de ligação ao carregar os alunos.", erro: true });
    }
  };

  useEffect(() => {
    const buscarTurmas = async () => {
      try {
        const resposta = await fetch("/api/turmas", {
          credentials: "include", 
        });
        if (resposta.ok) {
          const dadosAPI: TurmaApiRaw[] = await resposta.json();
          const turmasNormalizadas = dadosAPI.map(normalizarTurma);
          setTurmas(turmasNormalizadas);
          if (turmasNormalizadas.length > 0) {
            setTurmaSelecionada(turmasNormalizadas[0]);
            buscarAlunosDaTurma(turmasNormalizadas[0].id);
          } else {
            setAlunosDoBanco([]);
          }
          setMensagem({ texto: "", erro: false });
        }
      } catch (error) {
        console.error("Erro ao carregar turmas", error);
        setMensagem({ texto: "Falha de ligação ao carregar as turmas.", erro: true });
      }
    };
    buscarTurmas();
  }, []);

  const handleCriar = () => router.push("/turmas/criar");
  
  const handleEditar = () => {
    if (!turmaSelecionada) {
      setMensagem({ texto: "Selecione uma turma antes de editar.", erro: true });
      return;
    }
    setMensagem({ texto: "", erro: false });
    sessionStorage.setItem("turmaEdicao", JSON.stringify(turmaSelecionada));
    router.push("/turmas/criar");
  };

  const handleRemover = async () => {
    if (!turmaSelecionada) return;
    const confirmacao = window.confirm(`Tem a certeza que deseja eliminar a turma ${turmaSelecionada.codigo}?`);
    if (!confirmacao) return;

    try {
      const resposta = await fetch(`/api/turmas/${turmaSelecionada.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (resposta.ok) {
        const novaLista = turmas.filter((t) => t.id !== turmaSelecionada.id);
        setTurmas(novaLista);
        if (novaLista.length > 0) {
          setTurmaSelecionada(novaLista[0]);
          buscarAlunosDaTurma(novaLista[0].id);
        } else {
          setTurmaSelecionada(null);
          setAlunosDoBanco([]);
        }
        setMensagem({ texto: "Turma removida com sucesso.", erro: false });
      } else {
        setMensagem({ texto: "Erro ao remover a turma. Verifique no servidor.", erro: true });
      }
    } catch (error) {
      console.error("Erro ao remover turma", error);
      setMensagem({ texto: "Falha de conexão.", erro: true });
    }
  };

  const extrairQtdAlunosDoRaw = (raw?: TurmaApiRaw): number | undefined => {
    if (!raw) return undefined;

    for (const [chave, valor] of Object.entries(raw as Record<string, unknown>)) {
      const chaveNormalizada = chave.toLowerCase();
      const pareceContagem = chaveNormalizada.includes("qtd") || chaveNormalizada.includes("count");
      if (!pareceContagem) continue;

      if (typeof valor === "number" && !Number.isNaN(valor)) {
        return valor;
      }

      if (typeof valor === "string" && valor.trim() !== "") {
        const numero = Number(valor);
        if (!Number.isNaN(numero)) {
          return numero;
        }
      }
    }

    return undefined;
  };

  const qtdAlunosExibida =
    alunosDoBanco.length > 0
      ? alunosDoBanco.length
      : turmaSelecionada?.qtdAlunos ?? extrairQtdAlunosDoRaw(turmaSelecionada?.raw);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <main className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciar Turmas
              </h1>
              <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
                Selecione uma turma para ver detalhes e alunos matriculados.
              </p>
            </div>
          </div>

          {mensagem.texto && (
            <div className={`w-full p-4 rounded-lg text-sm font-medium border ${mensagem.erro ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"}`}>
              {mensagem.texto}
            </div>
          )}

          <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col pt-6 px-6 pb-8 transition-colors duration-300">
            
            {/* Seletor Dinâmico de Turmas */}
            <div className="w-full mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Selecionar Turma
              </label>
              <div className="relative">
                <select
                  value={turmaSelecionada?.id || ""}
                  onChange={(e) => {
                    const turma = turmas.find(t => t.id === e.target.value);
                    if (turma) {
                      setTurmaSelecionada(turma);
                      buscarAlunosDaTurma(turma.id);
                    } else {
                      setTurmaSelecionada(null);
                      setAlunosDoBanco([]);
                    }
                  }}
                  className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
                >
                  <option value="" disabled hidden>Selecione uma turma para gerir...</option>
                  {turmas.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.codigo} - {t.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* BOTOES DE AÇÃO */}
            <div className="w-full flex flex-wrap gap-4 mb-8">
              <button onClick={handleCriar} className="flex-1 sm:flex-none min-w-[120px] h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-sans font-medium text-sm transition-colors shadow-sm">
                Criar Nova
              </button>
              <button onClick={handleEditar} className="flex-1 sm:flex-none min-w-[120px] h-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-sans font-medium text-sm transition-colors shadow-sm">
                Editar Turma
              </button>
              <button onClick={handleRemover} className="flex-1 sm:flex-none min-w-[120px] h-10 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg font-sans font-medium text-sm transition-colors shadow-sm">
                Remover Turma
              </button>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-6 items-stretch">
              
              {/* Caixa de Detalhes Dinâmica */}
              <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-900/50 p-6 flex flex-col gap-4 font-sans border border-gray-200 dark:border-slate-700 rounded-xl">
                {turmaSelecionada ? (
                  <>
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Turma</span>
                      <span className="text-base font-bold text-gray-900 dark:text-white">{turmaSelecionada.nome}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Código</span>
                      <span className="inline-block text-sm font-mono text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{turmaSelecionada.codigo}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Horário</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{turmaSelecionada.horario}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Alunos (Qtd)</span>
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{qtdAlunosExibida ?? "--"} </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-60">
                    <span className="text-xs text-center text-gray-500 uppercase mt-2 font-medium">Nenhuma Turma Selecionada</span>
                  </div>
                )}
              </div>

              {/* Lista de Alunos */}
              <div className="flex-1 bg-gray-50 dark:bg-slate-900/50 h-[320px] overflow-y-auto rounded-xl custom-scrollbar border border-gray-200 dark:border-slate-700 p-4 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pb-2 border-b border-gray-200 dark:border-slate-700">Alunos Matriculados</h4>
                {turmaSelecionada ? (
                  alunosDoBanco.length > 0 ? (
                    alunosDoBanco.map((aluno, index) => (
                      <div key={aluno.id} className="w-full flex items-center text-sm py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-800 dark:text-gray-200">
                        <span className="font-semibold text-gray-400 dark:text-gray-500 w-6">{String(index + 1).padStart(2, "0")}.</span> 
                        <span className="font-medium">{aluno.nome}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum aluno cadastrado nesta turma.</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Selecione uma turma para ver os alunos.</span>
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