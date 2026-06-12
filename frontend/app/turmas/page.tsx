"use client";

import { useState, useEffect } from "react";
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
  
  // enviar os dados para a tela de edição
  const handleEditar = () => {
    if (!turmaSelecionada) {
      setMensagem({ texto: "Selecione uma turma antes de editar.", erro: true });
      return;
    }
    setMensagem({ texto: "", erro: false });
    // Guarda os dados da turma selecionada temporariamente na sessão
    sessionStorage.setItem("turmaEdicao", JSON.stringify(turmaSelecionada));
    router.push("/turmas/criar");
  };

  // Função para apagar a turma do banco de dados
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
        // Atualiza a lista visualmente sem recarregar a página
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
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col items-center py-8 px-4 md:px-8 shadow-2xl relative">
          <h1 className={`${daysOne.className} text-3xl text-black uppercase tracking-wider mb-6 text-center`}>
            GERENCIAR TURMAS
          </h1>

          {mensagem.texto && (
            <div className={`w-full max-w-5xl mb-4 p-4 rounded-xl text-sm font-bold text-center border-2 ${mensagem.erro ? "bg-[#1a0f1f] text-[#FF8D28] border-[#FF8D28]" : "bg-white text-[#4F0474] border-[#FF8D28]"}`}>
              {mensagem.texto}
            </div>
          )}

          <div className="w-full max-w-5xl bg-gradient-to-br from-[#4F0474] to-[#2c0242] rounded-[20px] flex flex-col pt-6 px-4 md:px-8 pb-8 shadow-inner border border-[#4F0474]/50">
            
            {/* Seletor Dinâmico de Turmas */}
            <div className="w-full h-[54px] bg-white/95 rounded-xl flex items-center px-4 shadow-md mb-6 shrink-0 relative focus-within:ring-2 focus-within:ring-white">
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
                className="w-full h-full bg-transparent border-none outline-none font-sans font-semibold text-sm text-gray-800 cursor-pointer appearance-none"
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

            <div className="w-full flex flex-wrap justify-center gap-4 md:gap-8 mb-6 shrink-0">
              <button onClick={handleCriar} className="w-full sm:w-[160px] h-[48px] bg-[#14AE5C] rounded-xl font-crimson font-bold text-lg text-white uppercase tracking-wide hover:bg-[#0f8c4a] active:scale-95 transition-all shadow-lg border-b-4 border-[#0d733d]">
                Criar
              </button>
              {/* NOVO: onClick do Editar adicionado */}
              <button onClick={handleEditar} className="w-full sm:w-[160px] h-[48px] bg-[#FF8D28] rounded-xl font-crimson font-bold text-lg text-white uppercase tracking-wide hover:bg-[#e0771f] active:scale-95 transition-all shadow-lg border-b-4 border-[#c46516]">
                Editar
              </button>
              <button onClick={handleRemover} className="w-full sm:w-[160px] h-[48px] bg-[#900B09] rounded-xl font-crimson font-bold text-lg text-white uppercase tracking-wide hover:bg-[#700605] active:scale-95 transition-all shadow-lg border-b-4 border-[#590403]">
                Remover
              </button>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-5">
              
              {/* Caixa de Detalhes Dinâmica */}
              <div className="w-full md:w-[220px] bg-white/95 p-5 flex flex-col justify-between font-crimson text-black shadow-md shrink-0 rounded-xl">
                {turmaSelecionada ? (
                  <>
                    <div className="mb-3">
                      <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Turma</span>
                      <span className="text-base font-bold text-gray-800">{turmaSelecionada.nome}</span>
                    </div>
                    <div className="mb-3">
                      <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Código</span>
                      <span className="text-sm font-mono text-gray-600 border border-gray-200 px-2 py-0.5 bg-gray-50 rounded">{turmaSelecionada.codigo}</span>
                    </div>
                    <div className="mb-3">
                      <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Horário</span>
                      <span className="text-sm font-semibold text-gray-600">{turmaSelecionada.horario}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Alunos (Qtd)</span>
                      <span className="text-xl font-bold text-[#4F0474]">{qtdAlunosExibida ?? "--"} </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-60">
                    <span className="font-sans text-xs text-center text-gray-500 uppercase tracking-widest mt-2">Nenhuma Turma Selecionada</span>
                  </div>
                )}
              </div>

              {/* Lista de Alunos */}
              <div className="flex-1 bg-white/95 h-[240px] overflow-y-auto shadow-md p-4 flex flex-col gap-2 rounded-xl custom-scrollbar border border-gray-100">
                <h4 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pb-2 border-b border-gray-100">Alunos Matriculados</h4>
                {turmaSelecionada ? (
                  alunosDoBanco.length > 0 ? (
                    alunosDoBanco.map((aluno, index) => (
                      <div key={aluno.id} className="w-full flex items-center font-crimson text-sm sm:text-base text-gray-800 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[#f3e8f5] transition-colors">
                        <span className="font-semibold text-[#4F0474] mr-2">{String(index + 1).padStart(2, "0")}.</span> {aluno.nome}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="font-sans text-sm italic text-gray-400">Nenhum aluno cadastrado nesta turma.</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="font-sans text-sm italic text-gray-400">Selecione uma turma para ver os alunos.</span>
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