"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

export default function Historico() {
  const router = useRouter();

  const [porcentagemPresentes, setPorcentagemPresentes] = useState(0);
  const [porcentagemAusentes, setPorcentagemAusentes] = useState(0);
  const [aulaSelecionadaId, setAulaSelecionadaId] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [aulas, setAulas] = useState<AulaHistorico[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  interface FrequenciaHistorico {
    status: "PRESENTE" | "FALTA";
    aluno: { id: string; nome: string };
  }

  interface AulaHistorico {
    id: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    descricao?: string | null;
    turma: { id: string; nome: string; codigo: string };
    frequencias: FrequenciaHistorico[];
  }

  const aulaSelecionada = useMemo(
    () => aulas.find((aula) => aula.id === aulaSelecionadaId) ?? aulas[0] ?? null,
    [aulas, aulaSelecionadaId],
  );

  const handleSalvar = () => {
    router.push("/controle");
  };

  useEffect(() => {
    const turma = new URLSearchParams(window.location.search).get("turmaId") || "";
    setTurmaId(turma);
  }, []);

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!turmaId) return;

      setCarregando(true);
      setErro("");
      try {
        const resposta = await fetch(`/api/aulas/turma/${turmaId}`, {
          credentials: "include",
        });

        if (resposta.ok) {
          const dados: AulaHistorico[] = await resposta.json();
          setAulas(dados);
          setAulaSelecionadaId(dados[0]?.id || "");
        } else if (resposta.status === 401 || resposta.status === 403) {
          router.push("/");
        } else {
          setErro("Não foi possível carregar o histórico da turma.");
        }
      } catch (error) {
        console.error("Erro ao carregar histórico", error);
        setErro("Falha de ligação ao servidor.");
      } finally {
        setCarregando(false);
      }
    };

    buscarHistorico();
  }, [turmaId, router]);

  useEffect(() => {
    if (!aulaSelecionada) return;

    const frequencias = aulaSelecionada.frequencias || [];
    const presentes = frequencias.filter((f) => f.status === "PRESENTE").length;
    const ausentes = frequencias.filter((f) => f.status === "FALTA").length;
    const total = presentes + ausentes || 1;
    setPorcentagemPresentes(Math.round((presentes / total) * 100));
    setPorcentagemAusentes(Math.round((ausentes / total) * 100));
  }, [aulaSelecionada]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <main className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                Histórico de Frequência
              </h1>
              <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
                Visualize as chamadas realizadas para esta turma.
              </p>
            </div>
            <button
              onClick={handleSalvar}
              className="h-10 px-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg font-sans font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm shrink-0"
            >
              Voltar ao Controle
            </button>
          </div>

          {erro && (
            <div className="w-full p-4 rounded-lg text-sm font-medium border bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              {erro}
            </div>
          )}

          <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 flex flex-col gap-6 transition-colors duration-300">
            
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Selecionar Aula Registrada
              </label>
              <div className="relative">
                <select
                  value={aulaSelecionadaId}
                  onChange={(e) => setAulaSelecionadaId(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
                >
                  {aulas.length === 0 ? (
                    <option value="">{carregando ? "Carregando..." : "Nenhuma aula encontrada"}</option>
                  ) : (
                    aulas.map((aula) => (
                      <option key={aula.id} value={aula.id}>
                        {new Date(aula.data).toLocaleDateString()} — {aula.hora_inicio} às {aula.hora_fim}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
              
              {/* Coluna 1: Resumo da Turma */}
              <div className="w-full lg:w-64 bg-gray-50 dark:bg-slate-900/50 p-6 flex flex-col gap-4 font-sans border border-gray-200 dark:border-slate-700 rounded-xl shrink-0">
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Turma</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">{aulaSelecionada?.turma?.nome || "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Código</span>
                  <span className="inline-block text-sm font-mono text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{aulaSelecionada?.turma?.codigo || "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Horário</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{aulaSelecionada ? `${aulaSelecionada.hora_inicio} - ${aulaSelecionada.hora_fim}` : "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Alunos Presentes</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{aulaSelecionada?.frequencias?.filter(f => f.status === "PRESENTE").length || 0} / {aulaSelecionada?.frequencias?.length || 0}</span>
                </div>
              </div>

              {/* Coluna 2: Anotações da Aula */}
              <div className="flex-1 bg-gray-50 dark:bg-slate-900/50 p-6 flex flex-col rounded-xl border border-gray-200 dark:border-slate-700">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">
                  Resumo da Aula
                </span>
                <textarea
                  value={aulaSelecionada?.descricao || ""}
                  readOnly
                  placeholder="Nenhuma observação registrada para esta aula."
                  className="w-full flex-1 bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 outline-none resize-none custom-scrollbar p-0"
                />
              </div>

              {/* Coluna 3: Gráfico de Frequência */}
              <div className="w-full lg:w-72 bg-gray-50 dark:bg-slate-900/50 p-6 flex flex-col rounded-xl border border-gray-200 dark:border-slate-700 items-center justify-between">
                <span className="block w-full text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 dark:border-slate-700 text-center">
                  Índice de Frequência
                </span>
                
                <div className="flex-1 w-full flex items-end justify-center gap-12 mt-4 pb-2">
                  {/* Barra Presentes */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="font-sans text-sm font-bold text-primary-600 dark:text-primary-400">{porcentagemPresentes}%</span>
                    <div className="w-16 h-32 bg-gray-200 dark:bg-slate-700 rounded-t-xl flex flex-col justify-end overflow-hidden relative">
                      <div
                        className="w-full bg-primary-500 dark:bg-primary-600 transition-all duration-1000"
                        style={{ height: `${porcentagemPresentes}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Presentes</span>
                  </div>

                  {/* Barra Ausentes */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="font-sans text-sm font-bold text-red-500 dark:text-red-400">{porcentagemAusentes}%</span>
                    <div className="w-16 h-32 bg-gray-200 dark:bg-slate-700 rounded-t-xl flex flex-col justify-end overflow-hidden relative">
                      <div
                        className="w-full bg-red-500 dark:bg-red-600 transition-all duration-1000"
                        style={{ height: `${porcentagemAusentes}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ausentes</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}